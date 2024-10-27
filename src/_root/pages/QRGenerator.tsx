import { useState } from 'react';
import QRCode from 'qrcode';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Loader from "@/components/shared/Loader";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const QRCodeValidation = z.object({
    text: z.string().min(1, 'Tekst je obavezan')
});

const QRGenerator = () => {
    const [qrCodePng, setQrCodePng] = useState('');
    const [qrCodeSvg, setQrCodeSvg] = useState('');
    const [isDownloadVisible, setIsDownloadVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(QRCodeValidation),
        defaultValues: {
            text: ''
        },
    });

    const generateQRCode = async (values) => {
        setIsLoading(true);
        try {
            // Generate PNG for display
            const pngUrl = await QRCode.toDataURL(values.text, { width: 1000, margin: 2 });
            setQrCodePng(pngUrl);

            // Generate SVG for download
            const svgString = await QRCode.toString(values.text, { type: 'svg' });
            setQrCodeSvg(svgString);
            setIsDownloadVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadSVG = () => {
        const svgBlob = new Blob([qrCodeSvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'qr-code.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">
                        QR Kod Generator
                    </h2>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(generateQRCode)} className="flex flex-col gap-9 w-full max-w-5xl">
                                {qrCodePng && (
                                    <div className="flex flex-col items-center">
                                        <div id="qr-code-container" className="mb-5">
                                            <img src={qrCodePng} alt="QR Kod" className="w-64 h-64" />
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
                                                    placeholder="Unesi tekst ili URL adresu"
                                                    className="shad-input"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="shad-form_message" />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-4 items-center justify-end">
                                    <Button type="submit" className="shad-button_primary">
                                        Generiraj QR kod
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

export default QRGenerator;
