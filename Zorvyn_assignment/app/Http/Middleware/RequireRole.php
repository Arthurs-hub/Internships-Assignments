<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->is_active) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (!$user->hasRole(...$roles)) {
            return response()->json(['message' => 'Forbidden. Required role: ' . implode(' or ', $roles)], 403);
        }

        return $next($request);
    }
}
