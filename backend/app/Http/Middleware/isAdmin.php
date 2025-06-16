<?php

    namespace App\Http\Middleware;

    use Closure;
    use Illuminate\Http\Request;
    use Symfony\Component\HttpFoundation\Response;
    use App\Models\User;
    use Illuminate\Support\Facades\Auth;

    class isAdmin
    {
        /**
         * Handle an incoming request.
         *
         * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
         */
        public function handle(Request $request, Closure $next): Response
        {
            if (!Auth::check()) {
                return redirect()->route('login');
            }

            if (Auth::user()->role == User::ADMINISTRADOR) {
                return $next($request);
            }

            abort(403, 'No tienes permisos para acceder a esta página');
        }
    }
