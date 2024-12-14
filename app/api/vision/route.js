// app/api/vision/route.js
import { NextResponse } from 'next/server';
import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Schema for line items in the invoice
const LineItemSchema = z.object({
    description: z.string().describe('Description of the item or service'),
    quantity: z.number().optional().describe('Quantity of the item'),
    unit_price: z.number().optional().describe('Price per unit'),
    amount: z.number().describe('Total amount for this line item')
});

// Schema for invoice analysis
const InvoiceSchema = z.object({
    invoice_number: z.string().describe('Invoice number or identifier'),
    date: z.string().describe('Invoice date'),
    due_date: z.string().optional().describe('Payment due date'),
    
    // Company/Vendor Information
    vendor: z.object({
        name: z.string().describe('Name of the company issuing the invoice'),
        address: z.string().optional().describe('Company address'),
        contact: z.string().optional().describe('Contact information'),
        tax_id: z.string().optional().describe('Tax ID or business number')
    }),

    // Customer Information
    customer: z.object({
        name: z.string().describe('Customer or client name'),
        address: z.string().optional().describe('Customer address'),
        contact: z.string().optional().describe('Customer contact information')
    }),

    // Financial Details
    items: z.array(LineItemSchema).describe('List of items or services'),
    
    subtotal: z.number().describe('Subtotal amount before tax'),
    tax_amount: z.number().optional().describe('Tax amount'),
    total: z.number().describe('Total amount including tax'),
    
    // Payment Information
    payment_terms: z.string().optional().describe('Payment terms'),
    payment_method: z.string().optional().describe('Accepted payment methods'),
    bank_details: z.string().optional().describe('Bank account information'),

    // Additional Fields
    notes: z.string().optional().describe('Any additional notes or comments'),
    currency: z.string().optional().describe('Currency used in the invoice'),
    status: z.enum(['paid', 'unpaid', 'partial', 'unknown']).optional().describe('Payment status of the invoice')
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image');
        
        if (!imageFile) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Convert the file to base64
        const buffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        // Prepare the message for Ollama
        const messages = [{
            role: 'user',
            content: 'Extract and analyze invoice information from this image. Return a structured JSON with all available invoice details including invoice number, dates, vendor info, customer info, line items, and financial details. For any fields that cannot be determined, omit them from the response.',
            images: [base64Image]
        }];

        // Call Ollama with the image
        const response = await ollama.chat({
            model: 'llama3.2-vision',
            messages: messages,
            format: zodToJsonSchema(InvoiceSchema),
            options: {
                temperature: 0
            }
        });

        // Validate the response
        try {
            const invoiceAnalysis = InvoiceSchema.parse(
                JSON.parse(response.message.content)
            );
            return NextResponse.json({ content: invoiceAnalysis });
        } catch (error) {
            console.error("Invalid response format:", error);
            return NextResponse.json(
                { error: 'Invalid response format from model' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error processing invoice:', error);
        return NextResponse.json(
            { error: 'Error processing invoice' },
            { status: 500 }
        );
    }
}
