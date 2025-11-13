<?php

namespace App\Enums;

enum DashboardMode: string
{
    case Worker = 'worker';
    case Client = 'client';

    public static function fromString(?string $value): self
    {
        return self::tryFrom($value ?? '') ?? self::Worker;
    }

    public function isWorker(): bool
    {
        return $this === self::Worker;
    }

    public function isClient(): bool
    {
        return $this === self::Client;
    }
}
