import express from 'express';
const router = express.Router();

// Ruta para enviar mensajes de contacto
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        res.status(200).json({ 
            success: true, 
            message: 'Mensaje recibido correctamente' 
        });
    } catch (error) {
        console.error('Error en contacto:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al procesar el mensaje' 
        });
    }
});

export default router; 