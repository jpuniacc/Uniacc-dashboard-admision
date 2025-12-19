import nodemailer from 'nodemailer'
import type { Postulante } from '../types/postulante.types'
import { formatChileTime } from '../utils/date.utils'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Configurar SMTP sin autenticación
    // Todas las configuraciones deben estar en el archivo .env
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT

    if (!smtpHost || !smtpPort) {
      console.warn('⚠️ [Email] SMTP_HOST o SMTP_PORT no están configurados en .env')
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost || '172.16.0.170', // Valor por defecto solo para desarrollo
      port: parseInt(smtpPort || '25'),
      secure: false, // true para 465, false para otros puertos
      auth: false, // Sin autenticación
      tls: {
        rejectUnauthorized: false // Para servidores SMTP internos sin certificado válido
      }
    } as nodemailer.TransportOptions)
  }

  /**
   * Genera el template HTML para notificación de nuevo postulante
   */
  private generateEmailTemplate(postulante: Postulante): string {
    const rutCompleto = `${postulante.RUT}-${postulante.DIGITO}`
    const nombreCompleto = `${postulante.NOMBRE} ${postulante.PATERNO} ${postulante.MATERNO}`.trim()
    const fechaPostulacion = postulante.FECREG ? new Date(postulante.FECREG).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'No disponible'
    
    const codigoCarrera = postulante.CARRINT1 || 'No especificado'
    const nombreCarrera = postulante.NOMBRE_C || 'No especificado'
    const email = postulante.EMAIL || 'No proporcionado'
    const telefono = postulante.CELULAR || postulante.TELEFONO || 'No proporcionado'

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo Postulante</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #1e40af; margin: 0 0 10px 0; font-size: 24px;">
            🎓 Nuevo Postulante - ${nombreCompleto}
        </h1>
        <p style="color: #666; margin: 0; font-size: 14px;">
            Sistema de Postulantes UNIACC
        </p>
    </div>

    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1e40af; font-size: 18px; margin-top: 0; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
            Información del Postulante
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; width: 40%; border: 1px solid #e5e7eb;">
                    RUT:
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                    ${rutCompleto}
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">
                    Nombre Completo:
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                    ${nombreCompleto}
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">
                    Código de Carrera:
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                    ${codigoCarrera}
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">
                    Carrera de Interés:
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                    ${nombreCarrera}
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">
                    Fecha de Postulación:
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                    ${fechaPostulacion}
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">
                    Email de Contacto:
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                    <a href="mailto:${email}" style="color: #1e40af; text-decoration: none;">${email}</a>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px; background-color: #f9fafb; font-weight: bold; border: 1px solid #e5e7eb;">
                    Teléfono de Contacto:
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                    <a href="tel:${telefono}" style="color: #1e40af; text-decoration: none;">${telefono}</a>
                </td>
            </tr>
        </table>
    </div>

    <div style="background-color: #f0f9ff; border-left: 4px solid #1e40af; padding: 15px; margin-top: 20px; border-radius: 4px;">
        <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
            <strong>Nota:</strong> Este es un correo automático generado por el sistema de postulantes UNIACC.
        </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">
            Sistema de Postulantes UNIACC - ${new Date().getFullYear()}
        </p>
    </div>
</body>
</html>
    `.trim()
  }

  /**
   * Envía correo de notificación de nuevo postulante
   */
  async enviarNotificacionNuevoPostulante(postulante: Postulante): Promise<boolean> {
    try {
      const recipients = (process.env.EMAIL_RECIPIENTS || '').split(',').map(email => email.trim()).filter(email => email.length > 0)
      
      if (recipients.length === 0) {
        console.warn('⚠️ [Email] No hay destinatarios configurados en EMAIL_RECIPIENTS')
        return false
      }

      const nombreCompleto = `${postulante.NOMBRE} ${postulante.PATERNO} ${postulante.MATERNO}`.trim()
      const htmlContent = this.generateEmailTemplate(postulante)
      const textContent = `
Nuevo Postulante - ${nombreCompleto}

RUT: ${postulante.RUT}-${postulante.DIGITO}
Nombre: ${nombreCompleto}
Código de Carrera: ${postulante.CARRINT1 || 'No especificado'}
Carrera: ${postulante.NOMBRE_C || 'No especificado'}
Fecha de Postulación: ${postulante.FECREG ? new Date(postulante.FECREG).toLocaleDateString('es-CL') : 'No disponible'}
Email: ${postulante.EMAIL || 'No proporcionado'}
Teléfono: ${postulante.CELULAR || postulante.TELEFONO || 'No proporcionado'}
      `.trim()

      const fromEmail = process.env.SMTP_FROM
      const fromName = process.env.SMTP_FROM_NAME || 'Sistema de Postulantes UNIACC'

      if (!fromEmail) {
        console.warn('⚠️ [Email] SMTP_FROM no está configurado en .env')
      }

      const mailOptions = {
        from: `"${fromName}" <${fromEmail || 'noreply@tudominio.cl'}>`,
        to: recipients.join(', '),
        subject: `🎓 Nuevo Postulante - ${nombreCompleto}`,
        text: textContent,
        html: htmlContent,
      }

      console.log(`📧 [Email] Enviando correo para postulante ${postulante.CODINT}...`)
      console.log(`   Destinatarios: ${recipients.join(', ')}`)
      console.log(`   Asunto: ${mailOptions.subject}`)
      
      const info = await this.transporter.sendMail(mailOptions)
      
      console.log(`✅ [Email] Notificación enviada exitosamente`)
      console.log(`   Postulante: ${postulante.CODINT} - ${nombreCompleto}`)
      console.log(`   Destinatarios: ${recipients.length} (${recipients.join(', ')})`)
      console.log(`   Message ID: ${info.messageId}`)
      console.log(`   Timestamp: ${formatChileTime()}`)
      
      return true
    } catch (error) {
      console.error(`❌ [Email] Error al enviar notificación para postulante ${postulante.CODINT}`)
      console.error(`   Error:`, error)
      if (error instanceof Error) {
        console.error(`   Mensaje: ${error.message}`)
      }
      return false
    }
  }

  /**
   * Verifica la conexión SMTP
   */
  async verificarConexion(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log('✅ [Email] Conexión SMTP verificada correctamente')
      return true
    } catch (error) {
      console.error('❌ [Email] Error al verificar conexión SMTP:', error)
      return false
    }
  }
}

