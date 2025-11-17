package com.hotel.billing.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Component
public class QRCodeUtil {

    private static final int QR_CODE_WIDTH = 300;
    private static final int QR_CODE_HEIGHT = 300;

    /**
     * Generate QR code as Base64 string
     */
    public String generateQRCodeBase64(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, QR_CODE_WIDTH, QR_CODE_HEIGHT);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] qrCodeBytes = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(qrCodeBytes);

        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    /**
     * Generate QR code for invoice URL
     */
    public String generateInvoiceQRCode(String invoiceUrl) {
        return generateQRCodeBase64(invoiceUrl);
    }

    /**
     * Generate unique QR token for bill
     */
    public String generateQRToken(String billNumber) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String data = billNumber + "_" + timestamp;
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data.getBytes());
    }
}
