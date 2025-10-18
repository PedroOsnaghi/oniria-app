// === UNIFORMS DEL ENGINE ===
uniform float uTime;
uniform vec2  uResolution;
uniform float uOnlyMask; // 0 = normal | 1 = solo Mask

// === CONTROLES DE INTENSIDAD ===
uniform float uPlasmaStrength;   // Fuerza del plasma interno (energía)
uniform float uGlassStrength;    // Fuerza del efecto vidrio/contenedor
uniform float uPlasmaRadius;     // Radio del plasma dentro de la esfera
uniform float uFresnelWidth;     // Qué tan "grueso" es el borde contenedor
uniform float uFresnelIntensity; // Intensidad del efecto fresnel
uniform float uFresnelBright;   // Brillo extra en el borde del contenedor
uniform float uFresnelBrightWidth; // Ancho del brillo extra en el borde del contenedor

// === CONTROLES DE COLOR SIMPLIFICADOS ===
uniform vec3 uColorInner;        // Color del centro/plasma (TU COLOR 1)
uniform vec3 uColorOuter;        // Color del borde/vidrio (TU COLOR 2)
uniform float uColorMixMode;     // 0 = aditivo, 1 = multiplicativo, 0.5 = promedio
uniform float uColorBalance;     // 0 = más interior, 1 = más exterior
uniform float uColorSaturation;  // Saturación general

// Control de dirección del humo/flujo
uniform float uSmokeDirectionOffset;  // Offset de dirección (animación del flujo)
uniform float uSmokeTurbulence;       // Turbulencia del flujo

// Control de gamma
uniform float uGammaCorrection;  // Corrección gamma

varying vec2 vUv;

#define TAU 6.28318530718

// === FUNCIONES HELPER PARA NOISE ===
float rand(vec2 n){return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);}
float noise(vec2 p){
  vec2 ip=floor(p),u=fract(p);
  u=u*u*(3.0-2.0*u);
  float res=mix(
    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
  return res*res;
}

// Fractal Brownian Motion - crea texturas complejas
float fbm(vec2 p,int oct){
  float s=0.0,m=0.0,a=0.5;
  for(int i=0;i<10;i++){
    if(i>=oct)break;
    s+=a*noise(p);
    m+=a;
    a*=0.5;
    p*=2.0;
  }
  return s/m;
}

float luma(vec3 c){return dot(c,vec3(0.299,0.587,0.114));}

// Función para saturación
vec3 saturate_color(vec3 color, float saturation) {
    float gray = luma(color);
    return mix(vec3(gray), color, saturation);
}

// Función para mezclar colores con diferentes modos
vec3 mixColors(vec3 color1, vec3 color2, float factor, float mode) {
    if (mode < 0.33) {
        // Modo aditivo
        return color1 + color2 * factor;
    } else if (mode < 0.66) {
        // Modo multiplicativo
        return color1 * mix(vec3(1.0), color2, factor);
    } else {
        // Modo promedio/lerp
        return mix(color1, color2, factor);
    }
}

// === EFECTO GLASS/CONTENEDOR SIMPLIFICADO ===
vec3 glassLayer(vec2 uv, float t) {
    float l = dot(uv, uv);
    float sm = smoothstep(1.0, 0.98, l);
    
    // Fresnel effect - brillo en los bordes
    float d = sm * l * l * l * uFresnelIntensity;
    
    // Noise turbulento para textura del vidrio
    float nx = fbm(uv * 3.0 + t * 0.2 + 58.69, 8);
    float ny = fbm(uv * 3.0 + t * uSmokeTurbulence + 26.31, 5);
    float n = fbm(uv * 3.0 + 2.0 * vec2(nx, ny) + sin(t) * 0.5, 4);
    n = pow(n, 1.1);
    
    // Color base del vidrio usando tu color exterior
    vec3 col = uColorOuter * (n * 0.6 + 0.45);
    
    // Variación sutil basada en la rotación
    float a = atan(uv.y, uv.x) / TAU + t * uSmokeDirectionOffset;
    float variation = sin(a * 3.0) * 0.1 + 0.9; // Variación sutil
    col *= variation;
    
    // Aplicar efecto fresnel
    vec3 c = col * d;
    
    // Brillos adicionales en la superficie
    float g = 2.8 * smoothstep(0.6, 1.0, fbm(uv * 3.0, 3)) * d;
    c += g * uColorOuter;
    
    // Fresnel final - borde brillante del contenedor
    float fresnelMask = pow((1.0 - smoothstep(1.0, uFresnelWidth, l) 
                            - pow(max(0.0, length(uv) - 1.0), uFresnelBrightWidth)) * uFresnelBright, 2.5);
    col = c + col * fresnelMask;
    col += uColorOuter * (1.0 - d) * sm * 0.45;
    
    return col;
}

// === PLASMA INTERNO/ENERGÍA SIMPLIFICADO ===
vec3 plasmaLayer(vec2 p, float t) {
    vec2 z = vec2(0.0);
    vec2 i = vec2(0.0);
    
    // Deformación compleja del espacio para efecto orgánico
    vec2 f = p * (z += 4.2 - 4.0 * abs(0.3 - dot(p, p)));
    vec4 O = vec4(0.0);
    
    // Loop para crear patrones fractales animados
    for(i.y = 1.; i.y < 8.0; i.y++) {
        O += (sin(f) + 1.5).xyyx * abs(f.x - f.y);
        f += cos(f.yx * i.y + i + t) / i.y + 0.7; // Animación temporal
    }
    
    // Transformaciones de color simplificadas usando tu color interior
    O = tanh(7.0 * exp(z.x - 5. + p.x * 0.2) / O);
    O = pow(O, vec4(1.1)); // Contraste
    
    // Usar directamente tu color interior
    vec3 color = uColorInner * O.rgb;
    
    return color;
}

// === FUNCIÓN PRINCIPAL ===
void main() {
    // Coordenadas centradas y escaladas
    vec2 uv = (vUv - 0.5) * 5.0;
    float r = length(uv);
    float t = uTime;

    // === COMBINACIÓN DE CAPAS ===
    
    // Máscara para controlar dónde aparece el plasma
    float plasmaMask = 1.0 - 0.2 * smoothstep(uPlasmaRadius, 0.0, r);
    
    // Capa de plasma interno (energía) - TU COLOR 1
    vec3 colPlasma = plasmaLayer(uv, t) * uPlasmaStrength;
    
    // Capa de vidrio/contenedor (borde brillante) - TU COLOR 2
    vec3 colGlass = glassLayer(uv, t) * uGlassStrength;

    // === MEZCLA CONTROLABLE ===
    // Controlar cómo se mezclan los dos colores
    float mixFactor = uColorBalance;
    vec3 color = mixColors(colPlasma, colGlass, mixFactor, uColorMixMode);
    
    // Aplicar saturación
    color = saturate_color(color, uColorSaturation);
    
    // Corrección gamma para mejor visualización
    color = pow(color, vec3(uGammaCorrection));

    gl_FragColor = vec4(color, 1.0);
}