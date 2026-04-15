import User from "../models/user.model.js";

let latestMessageState = null;

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

  if (body.cuidador && typeof body.cuidador === "object") {
    return [{ cuidador: body.cuidador }];
  }

  if (body.id && body.email && body.nombre) {
    return [{ cuidador: body }];
  }

  return [];
};

const getRandomUser = async () => {
  const users = await User.aggregate([{ $sample: { size: 1 } }]);
  return users[0] || null;
};

const storeLatestMessageState = (payload, status) => {
  latestMessageState = {
    success: true,
    status,
    objetosMensaje: payload.objetosMensaje || [],
    version: payload.version || "v2",
    updatedAt: new Date().toISOString(),
  };
};

export const getLatestMessage = async (req, res) => {
  if (!latestMessageState) {
    return res.status(404).json({
      success: false,
      message: "No message has been processed yet",
    });
  }

  return res.status(200).json(latestMessageState);
};

export const receiveSebasMessage = async (req, res) => {
  const objetosMensaje = extractMessageObjects(req.body);

  if (objetosMensaje.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing objetosMensaje in Sebas callback body",
    });
  }

  const payload = {
    objetosMensaje,
    version: req.body?.version || "v2",
  };

  storeLatestMessageState(payload, "completed_with_sebas");

  return res.status(200).json({
    success: true,
    message: "Sebas message stored successfully",
    objetosMensaje: payload.objetosMensaje,
    version: payload.version,
  });
};

export const processMessage = async (req, res) => {
  try {
    const objetosMensaje = extractMessageObjects(req.body);
    if (objetosMensaje.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing cuidador or objetosMensaje in request body",
      });
    }

    const usuario = await getRandomUser();
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "No users available to send to Sebas",
      });
    }

    const sebasMessageUrl = buildSebasMessageUrl();
    if (!sebasMessageUrl) {
      return res.status(500).json({
        success: false,
        message: "SEBASTIAN_MESSAGE_API_URL is not configured",
      });
    }

    const payloadToSebas = {
      objetosMensaje: [...objetosMensaje, { usuario }],
      version: "v2",
    };

    storeLatestMessageState(payloadToSebas, "waiting_for_sebas");

    const downstreamResponse = await fetch(sebasMessageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadToSebas),
    });

    if (!downstreamResponse.ok) {
      storeLatestMessageState(payloadToSebas, "failed_to_send_to_sebas");
      return res.status(downstreamResponse.status).json({
        success: false,
        message: "Failed to send message to Sebas",
        objetosMensaje: payloadToSebas.objetosMensaje,
      });
    }

    const responseBody = await downstreamResponse.json();
    if (responseBody?.objetosMensaje) {
      storeLatestMessageState(
        {
          objetosMensaje: responseBody.objetosMensaje,
          version: responseBody.version || "v2",
        },
        "completed_with_sebas"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Message sent to Sebas successfully",
      objetosMensaje: payloadToSebas.objetosMensaje,
      version: "v2",
    });
  } catch (error) {
    console.log("Error processing message:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error processing message",
      error: error.message,
    });
  }
};

export const enrichMessage = async (req, res) => {
  try {
    const objetosMensaje = extractMessageObjects(req.body);
    const usuario = await getRandomUser();

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "No users available to enrich the message",
      });
    }

    const enrichedPayload = {
      success: true,
      objetosMensaje: [...objetosMensaje, { usuario }],
      apiVersion: "v2",
    };

    storeLatestMessageState(
      {
        objetosMensaje: enrichedPayload.objetosMensaje,
        version: "v2",
      },
      "local_enriched"
    );

    return res.status(200).json(enrichedPayload);
  } catch (error) {
    console.log("Error enriching message:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error enriching message",
      error: error.message,
    });
  }
};
