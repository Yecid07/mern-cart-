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
    const cuidador = req.body; // objeto enviado desde tu API .NET

    if (!cuidador || !cuidador.email) {
      return res.status(400).json({ error: "Payload inválido: falta cuidador.email" });
    }

    // Buscar usuario relacionado en BD
    const usuario = await User.findOne().lean();

    // Concatenar en una lista
    const lista = [cuidador, usuario].filter(Boolean);

    // Si quieres guardar histórico:
    // await MensajesModel.create({ cuidador, usuario, lista, createdAt: new Date() });

    return res.status(200).json({
      mensaje: "Cuidador recibido y concatenado con usuario",
      lista
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno", detalle: error.message });
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