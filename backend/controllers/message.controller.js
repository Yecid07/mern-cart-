import Order from "../models/order.model.js";

/**
 * POST /api/v2/mensaje
 * Recibe mensaje de Sebas (entidad B) con entidad A agregada
 * Agrega entidad C (Order) y propaga la respuesta
 */
export const processMessage = async (req, res) => {
  try {
    const { entidadA, entidadB, metadata } = req.body;

    // Validar que haya contenido previo
    if (!entidadA || !entidadB) {
      return res.status(400).json({
        success: false,
        message: "Missing entidadA or entidadB in the message chain"
      });
    }

    // Obtener un Order de la BD (entidad C de Yécid)
    const entidadC = await Order.findOne({})
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .lean();

    if (!entidadC) {
      return res.status(404).json({
        success: false,
        message: "No orders available to add to message chain"
      });
    }

    // Agregar metadata del paso actual
    const updatedMetadata = {
      ...metadata,
      yecidProcessedAt: new Date().toISOString(),
      yecidService: "Orders API - Cloud Run (GCP)"
    };

    // Construir respuesta con las 3 entidades
    const responseMessage = {
      success: true,
      message: "Message processed through all services",
      chain: {
        entidadA, // De Santiago (AWS)
        entidadB, // De Sebas (GCP)
        entidadC, // De Yécid (GCP) - Orders
      },
      metadata: updatedMetadata,
      processedAt: new Date().toISOString(),
      version: "v2"
    };

    res.status(200).json(responseMessage);
  } catch (error) {
    console.log("Error processing message:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error processing message",
      error: error.message
    });
  }
};

/**
 * POST /api/v2/mensaje/enrich
 * Versión alternativa que permite pasar objetos específicos a enriquecer
 */
export const enrichMessage = async (req, res) => {
  try {
    const { previousEntities, orderId } = req.body;

    let entidadC;
    if (orderId) {
      entidadC = await Order.findById(orderId)
        .populate("user", "name email")
        .populate("items.product", "name price image")
        .lean();

      if (!entidadC) {
        return res.status(404).json({
          success: false,
          message: `Order with ID ${orderId} not found`
        });
      }
    } else {
      entidadC = await Order.findOne({})
        .populate("user", "name email")
        .populate("items.product", "name price image")
        .lean();
    }

    const enrichedMessage = {
      success: true,
      entities: {
        ...previousEntities,
        entidadC // Agrega Orders
      },
      processedBy: "Yécid - Orders Service (Cloud Run GCP)",
      timestamp: new Date().toISOString(),
      apiVersion: "v2"
    };

    res.status(200).json(enrichedMessage);
  } catch (error) {
    console.log("Error enriching message:", error.message);
    res.status(500).json({
      success: false,
      message: "Error enriching message",
      error: error.message
    });
  }
};
