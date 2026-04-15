import User from "../models/user.model.js";

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

    const downstreamResponse = await fetch(sebasMessageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadToSebas),
    });

    const responseBody = await downstreamResponse.json();
    return res.status(downstreamResponse.status).json(responseBody);
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

    return res.status(200).json({
      success: true,
      objetosMensaje: [...objetosMensaje, { usuario }],
      apiVersion: "v2",
    });
  } catch (error) {
    console.log("Error enriching message:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error enriching message",
      error: error.message,
    });
  }
};
