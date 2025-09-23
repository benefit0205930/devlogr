<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'budget_min',
        'budget_max',
        'deadline',
        'user_id',
        'status'
    ];

    protected $casts = [
        'deadline' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
