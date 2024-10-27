import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import JsBarcode from 'jsbarcode';
import Loader from "@/components/shared/Loader";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Validacija za EAN-13 barkod (13 cifara)
const BarcodeValidation = z.object({
    text: z.string()
        .length(13, 'Unesite točno 13 znamenki')
        .regex(/^\d+$/, 'Samo znamenke su dozvoljene')
        .refine((value) => validateEAN13(value), {
            message: "Uneseni EAN-13 kod nije ispravan. Provjerite unos.",
        })
});

// Funkcija za provjeru kontrolne cifre EAN-13 koda
function validateEAN13(ean13) {
    const sum = ean13
        .slice(0, -1)
        .split('')
        .map(Number)
        .reduce((acc, digit, idx) => acc + digit * (idx % 2 === 0 ? 1 : 3), 0);
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === Number(ean13[12]);
}

const BarcodeGenerator = () => {
    const [barcodeSvg, setBarcodeSvg] = useState('');
    const [isDownloadVisible, setIsDownloadVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(BarcodeValidation),
        defaultValues: {
            text: ''
        },
    });

    const generateBarcode = async (values) => {
        setIsLoading(true);
        try {
            // Ispravljeni namespace za SVG
            const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            JsBarcode(svgElement, values.text, { format: 'EAN13', displayValue: true });
            const svgString = new XMLSerializer().serializeToString(svgElement);
            setBarcodeSvg(svgString);
            setIsDownloadVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadSVG = () => {
        const blob = new Blob([barcodeSvg], { type: 'image/svg+xml;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'ean13-barcode.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">
                        EAN-13 Barcode Generator
                    </h2>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(generateBarcode)} className="flex flex-col gap-9 w-full max-w-5xl">
                                {barcodeSvg && (
                                    <div className="flex flex-col items-center">
                                        <div id="barcode-container" className="mb-5">
                                            <div dangerouslySetInnerHTML={{ __html: barcodeSvg }} />
                                        </div>
                                        {isDownloadVisible && (
                                            <Button onClick={downloadSVG} className="shad-button_primary mb-5">
                                                Preuzmi kao SVG
                                            </Button>
                                        )}
                                    </div>
                                )}
                                <FormField
                                    control={form.control}
                                    name="text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Unesite 13 znamenki"
                                                    className="shad-input"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4 items-center justify-end">
                                    <Button type="submit" className="shad-button_primary" disabled={isLoading}>
                                        {isLoading ? 'Generiranje...' : 'Generiraj EAN-13 barkod'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarcodeGenerator;
