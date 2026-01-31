<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Dompdf\Dompdf;
use Dompdf\Options;
use Dompdf\CanvasFactory;

class InstallFonts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fonts:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Register local fonts in storage/fonts with Dompdf';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $fontDir = storage_path('fonts');
        $this->info("Scanning fonts in: $fontDir");

        if (!is_dir($fontDir)) {
            $this->error("Directory not found: $fontDir");
            return 1;
        }

        $options = new Options([
            'fontDir' => $fontDir,
            'fontCache' => $fontDir,
            'isRemoteEnabled' => true, // Needed for registerFont to "load" local files via path
        ]);

        $dompdf = new Dompdf($options);
        $fontMetrics = $dompdf->getFontMetrics();

        // Define fonts to register
        // Family name => [style => filename]
        $fonts = [
            'ipaexgothic' => [
                'normal' => 'ipaexg.ttf',
                'bold' => 'ipaexg.ttf',
            ],
            'kleeone' => [
                'normal' => 'KleeOne-Regular.ttf',
                'bold' => 'KleeOne-SemiBold.ttf',
            ],
        ];

        foreach ($fonts as $family => $variants) {
            foreach ($variants as $style => $filename) {
                $path = $fontDir . '/' . $filename;
                if (!file_exists($path)) {
                    $this->warn("Missing font file: $path");
                    continue;
                }

                $this->info("Registering $family ($style)...");

                // registerFont expects an array for style
                $styleArr = [
                    'family' => $family,
                    'style' => $style,
                    'weight' => $style, // Using same for weight as Dompdf's getType handles this
                ];

                try {
                    $success = $fontMetrics->registerFont($styleArr, $path);
                    if ($success) {
                        $this->info("Successfully registered $family ($style)");
                    } else {
                        $this->error("Failed to register $family ($style)");
                    }
                } catch (\Exception $e) {
                    $this->error("Error registering $family ($style): " . $e->getMessage());
                }
            }
        }

        $this->info("Font installation completed.");
        return 0;
    }
}
