<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use OwenIt\Auditing\Contracts\Auditable;

class Student extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;    

    protected $guarded = ['id']; 

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        // Generate UUID saat creating
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function researchProposals()
    {
        return $this->hasMany(ResearchProposal::class);
    }
}
