import User from "../models/user.model.js";
import { saveMessageLog } from "../config/firestore.js";

const buildSebasMessageUrl = () => {
  const baseUrl = process.env.SEBASTIAN_MESSAGE_API_URL;
  if (!baseUrl) {
    return null;
  }

  return baseUrl.replace(/\/+$/, "");
};

const extractMessageObjects = (body = {}) => {
  if (Array.isArray(body.objetosMensaje)) {
    return body.objetosMensaje;
  }

  if (Array.isArray(body.chain)) {
    return body.chain;
  }

  return [];
};

/**
 * POST /api/v2/mensaje
 * Recibe mensaje desde Santiago con el cuidador, agrega usuario y lo reenvia a Sebas.
 */
export const processMessage = async (req, res) => {
  try {
    const objetosMensaje = extractMessageObjects(req.body);
    const metadata = req.body?.metadata || {};

    await saveMessageLog({
      stage: "received_from_santiago",
      payload: req.body,
      metadata,
    });

    if (objetosMensaje.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing objetosMensaje in the message chain",
      });
    }

    const usuario = await User.findOne({}).lean();
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "No users available to add to message chain",
      });
    }

    const sebasMessageUrl = buildSebasMessageUrl();
    if (!sebasMessageUrl) {
      return res.status(500).json({
        success: false,
        message: "SEBASTIAN_MESSAGE_API_URL is not configured",
      });
    }

    const updatedMessage = {
      objetosMensaje: [...objetosMensaje, { usuario }],
      metadata: {
        ...metadata,
        yecidProcessedAt: new Date().toISOString(),
        yecidService: "Users API - Cloud Run (GCP)",
      },
      version: "v2",
    };

    await saveMessageLog({
      stage: "forwarded_to_sebas",
      payload: updatedMessage,
      metadata: updatedMessage.metadata,
    });

    const downstreamResponse = await fetch(sebasMessageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMessage),
    });

    const responseBody = await downstreamResponse.json();
    await saveMessageLog({
      stage: "response_from_sebas",
      payload: responseBody,
      metadata: updatedMessage.metadata,
      statusCode: downstreamResponse.status,
    });
    return res.status(downstreamResponse.status).json(responseBody);
  } catch (error) {
    console.log("Error processing message:", error.message);
    await saveMessageLog({
      stage: "message_chain_error",
      payload: req.body,
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      message: "Server error processing message",
      error: error.message,
    });
  }
};

/**
 * POST /api/v2/mensaje/enrich
 * Permite enriquecer el arreglo de objetos con un usuario especifico o el primero disponible.
 */
export const enrichMessage = async (req, res) => {
  try {
    const { userId } = req.body || {};
    const objetosMensaje = extractMessageObjects(req.body);

    let usuario;
    if (userId) {
      usuario = await User.findById(userId).lean();

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${userId} not found`,
        });
      }
    } else {
      usuario = await User.findOne({}).lean();
    }

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "No users available to enrich the message",
      });
    }

    const enrichedPayload = {
      success: true,
      objetosMensaje: [...objetosMensaje, { usuario }],
      processedBy: "Yecid - Users Service (Cloud Run GCP)",
      timestamp: new Date().toISOString(),
      apiVersion: "v2",
    };

    await saveMessageLog({
      stage: "local_enrich_message",
      payload: enrichedPayload,
    });

    return res.status(200).json(enrichedPayload);
  } catch (error) {
    console.log("Error enriching message:", error.message);
    await saveMessageLog({
      stage: "local_enrich_error",
      payload: req.body,
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      message: "Error enriching message",
      error: error.message,
    });
  }
};
