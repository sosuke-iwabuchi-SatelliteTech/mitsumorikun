<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Dompdf\Dompdf;
use Dompdf\Options;

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
        $this->info("Real path: " . (realpath($fontDir) ?: 'Not found'));

        if (!is_dir($fontDir)) {
            $this->error("Directory not found: $fontDir");
            return 1;
        }

        // Check if directory is writable
        if (!is_writable($fontDir)) {
            $this->error("Directory is not writable: $fontDir");
            $this->warn("Current User: " . (function_exists('posix_getpwuid') ? posix_getpwuid(posix_geteuid())['name'] : get_current_user()));
            if (function_exists('posix_getpwuid')) {
                $this->warn("Directory Owner: " . posix_getpwuid(fileowner($fontDir))['name']);
            }
            $this->warn("Permissions: " . substr(sprintf('%o', fileperms($fontDir)), -4));
            return 1;
        }

        $chroot = [
            base_path(),
            storage_path(),
        ];

        // Add real paths to chroot to handle symlinks
        if ($realBasePath = realpath(base_path())) {
            $chroot[] = $realBasePath;
        }
        if ($realStoragePath = realpath(storage_path())) {
            $chroot[] = $realStoragePath;
        }
        // Broaden chroot for common server structures
        $chroot[] = '/var/www/mitsumorikun';

        $this->info("Chroot paths: " . implode(', ', array_unique($chroot)));

        $options = new Options([
            'fontDir' => $fontDir,
            'fontCache' => $fontDir,
            'tempDir' => storage_path('framework/cache'),
            'isRemoteEnabled' => true,
            'chroot' => array_unique($chroot),
        ]);

        $dompdf = new Dompdf($options);
        $fontMetrics = $dompdf->getFontMetrics();

        // Capture Dompdf warnings
        set_error_handler(function ($errno, $errstr) {
            if ($errno === E_USER_WARNING || $errno === E_WARNING) {
                $this->warn("Dompdf Warning: $errstr");
            }
        });

        // Define fonts to register
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

        $allSuccess = true;
        foreach ($fonts as $family => $variants) {
            foreach ($variants as $style => $filename) {
                $path = $fontDir . '/' . $filename;
                if (!file_exists($path)) {
                    $this->warn("Missing font file: $path");
                    $allSuccess = false;
                    continue;
                }

                $this->info("Registering $family ($style)...");

                $styleArr = [
                    'family' => $family,
                    'style' => $style,
                    'weight' => $style,
                ];

                try {
                    $success = $fontMetrics->registerFont($styleArr, $path);
                    if ($success) {
                        $this->info("Successfully registered $family ($style)");
                    } else {
                        $this->error("Failed to register $family ($style)");
                        $allSuccess = false;
                    }
                } catch (\Exception $e) {
                    $this->error("Error registering $family ($style): " . $e->getMessage());
                    $allSuccess = false;
                }
            }
        }

        restore_error_handler();

        if ($allSuccess) {
            $this->info("Font installation completed successfully.");
            return 0;
        } else {
            $this->error("Font installation completed with some errors.");
            return 1;
        }
    }
}
