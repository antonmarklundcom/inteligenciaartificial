// GLSL for the particle-brain scene. The shaders run on a seconds clock.

// 3D simplex noise — Ian McEwan, Ashima Arts (MIT). https://github.com/stegu/webgl-noise
export const SNOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

export const QINTIC_IN_OUT = `float qinticInOut(float x){float inValue=16.0*x*x*x*x*x;float outValue=1.0-pow(-2.0*x+2.0,5.0)/2.0;return step(inValue,0.5)*inValue+step(0.5,outValue)*outValue;}
`;

export const ROTATION = `mat4 rotationMatrix(vec3 axis,float angle){axis=normalize(axis);float s=sin(angle);float c=cos(angle);float oc=1.0-c;
return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.0,
oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.0,
oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.0,
0.0,0.0,0.0,1.0);}
mat3 calcLookAtMatrix(vec3 origin,vec3 target,float roll){vec3 rr=vec3(sin(roll),cos(roll),0.0);vec3 ww=normalize(target-origin);vec3 uu=normalize(cross(ww,rr));vec3 vv=normalize(cross(uu,ww));return mat3(uu,vv,ww);}
`;

export const MAP = `float map(float value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}
`;

// Cones: the position comes from the spring simulation; the cursor pushes and grows nearby cones.
export const CONE_VERTEX = `vec4 mvPosition=vec4(transformed,1.0);
vec3 pos=texture2D(t_simulation,vec2(a_id.x*2.,a_id.y*2.)).xyz;
vec4 mPos=vec4(pos,1.);
mPos*=rotationMatrix(vec3(1.,0.,0.),u_rotation.x*-1.);
mPos*=rotationMatrix(vec3(0.,1.,0.),u_rotation.y*-1.);
mPos*=rotationMatrix(vec3(0.,0.,1.),u_rotation.z*-1.);
mPos.y-=1.;
mPos.x+=u_offset.x;
mPos.y+=u_offset.y;
vec2 resolution=mix(u_resolution-u_resolution*0.5,u_resolution2-u_resolution2*0.5,min(1.,max(0.,u_progress2)));
vec2 m=u_mouse*vec2(1.,1.);
float dist=smoothstep(1.25+abs(max(u_delta.x,u_delta.y)),0.,distance(mPos.xy,m*resolution));
pos.x+=dist*sin(u_time*a_random.y)*(a_random.z*0.35+u_delta.x)*abs(u_explode-1.);
pos.y+=dist*cos(u_time*a_random.y)*(a_random.z*0.35+u_delta.y)*abs(u_explode-1.);
float n=snoise(pos*u_amplitude);
mat4 rotMat2=rotationMatrix(vec3(0.,1.,1.),mod(n+u_time,3.1416*2.));
float scale=texture2D(t_scale,a_id).x*u_scale;
float scale2=texture2D(t_scale,vec2(a_id.x+0.5,a_id.y)).x*u_scale;
scale=mix(scale,scale2,u_progress);
scale+=dist*0.75*abs(u_explode-1.);
#ifdef USE_INSTANCING
  mat4 instanceMat=instanceMatrix;
  instanceMat[3][0]=instanceMat[3][0]+pos.x;
  instanceMat[3][1]=instanceMat[3][1]+pos.y;
  instanceMat[3][2]=instanceMat[3][2]+pos.z;
  mat4 rotMat3=mat4(calcLookAtMatrix(vec3(instanceMat[3][0]+u_offset.x,instanceMat[3][1]+u_offset.y,instanceMat[3][2]),cameraPosition,0.));
  instanceMat[0][0]=instanceMat[0][0]*scale;
  instanceMat[1][1]=instanceMat[1][1]*scale;
  instanceMat[2][2]=instanceMat[2][2]*scale;
  if(u_mobileRotation>0.){instanceMat*=rotMat3;}else{instanceMat*=rotMat2;}
  mvPosition=instanceMat*mvPosition;
#endif
mat4 modViewMatrix=modelViewMatrix;
modViewMatrix[3][0]+=u_offset.x;
modViewMatrix[3][1]+=u_offset.y;
modViewMatrix*=rotationMatrix(vec3(1.,0.,0.),u_rotation.x);
modViewMatrix*=rotationMatrix(vec3(0.,1.,0.),u_rotation.y);
modViewMatrix*=rotationMatrix(vec3(0.,0.,1.),u_rotation.z);
mvPosition=modViewMatrix*mvPosition;
v_pos=mvPosition.xyz;
v_pos.z+=10.;
gl_Position=projectionMatrix*mvPosition;
v_id=a_id;
v_hover=dist;`;

export const CONE_FRAGMENT = `vec3 col=texture2D(t_color,v_id).xyz;
vec3 col2=texture2D(t_color,vec2(v_id.x+0.5,v_id.y)).xyz;
col=mix(col,col2,u_progress);
col=mix(col,vec3(0.45),max(0.,v_hover-u_explode)*abs(u_explode-1.));
outgoingLight.rgb=col.rgb*u_colorFactor;
float alpha=diffuseColor.a*smoothstep(-4.5,4.,v_pos.z);
gl_FragColor=vec4(outgoingLight,alpha);`;

export const WORLDPOS = `#if defined(USE_ENVMAP)||defined(DISTANCE)||defined(USE_SHADOWMAP)||defined(USE_TRANSMISSION)
vec4 worldPosition=vec4(transformed,1.0);
#ifdef USE_INSTANCING
worldPosition=instanceMat*worldPosition;
#endif
worldPosition=modelMatrix*worldPosition;
#endif`;

export const DEPTH_FRAGMENT = `float color=1.0-smoothstep(u_near,u_far,vViewZDepth);
gl_FragColor=vec4(vec3(color),1.0);`;

export const SIM_VERTEX = `precision highp float;
uniform mat4 projectionMatrix;uniform mat4 modelViewMatrix;
attribute vec2 position;attribute vec2 uv;varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,0.,1.);}`;

// t_position holds one 100×100 shape per quadrant: the brain, then the map of Paraguay.
export const SIM_POS = `precision highp float;
uniform sampler2D t_position;uniform sampler2D t_oPos;uniform sampler2D t_velocity;uniform sampler2D t_params;uniform sampler2D t_params2;
uniform float u_factor;uniform float u_length;uniform float u_show;uniform float u_explode;uniform float u_progress;uniform float u_rendered;
varying vec2 vUv;
${QINTIC_IN_OUT}
void main(){
  vec4 tOpos=texture2D(t_oPos,vUv);vec3 pos=tOpos.xyz;
  if(u_rendered>0.){vec4 tVelocity=texture2D(t_velocity,vUv);pos+=tVelocity.xyz;}
  else{
    vec4 tParams=texture2D(t_params,vUv);vec4 tParams2=texture2D(t_params2,vUv);
    float d=0.00005;float d2=0.0005;
    float showVal=min(1.,max(0.,(u_show*(1.+d*(u_length-1.)))-d*tParams.z));showVal=qinticInOut(showVal);
    float radius=mix(u_factor+tParams.x*3.,u_factor,showVal)+min(1.,max(0.,(u_explode*(u_length-1.))-d2*tParams2.w));
    pos=(texture2D(t_position,vec2(vUv.x*0.5,vUv.y*0.5)).xyz-0.5)*2.*radius;
    vec3 pos2=(texture2D(t_position,vec2(vUv.x*0.5+0.5,vUv.y*0.5)).xyz-0.5)*2.*radius;
    pos=mix(pos,pos2,u_progress);
  }
  gl_FragColor=vec4(pos,1.);
}`;

export const SIM_SPRING = `precision highp float;
uniform sampler2D t_oTarget;uniform sampler2D t_position;uniform sampler2D t_oVelocity;uniform sampler2D t_params;uniform sampler2D t_params2;uniform sampler2D t_params3;
uniform float u_factor;uniform float u_length;uniform float u_show;uniform float u_explode;uniform float u_progress;uniform float u_spring;uniform float u_friction;uniform float u_rendered;uniform float u_delay;
varying vec2 vUv;
${QINTIC_IN_OUT}
void main(){
  float vx=0.,vy=0.,vz=0.;
  if(u_rendered>0.){
    vec4 tParams=texture2D(t_params,vUv);vec4 tParams2=texture2D(t_params2,vUv);vec4 tParams3=texture2D(t_params3,vUv);
    float d=0.00005;float d3=0.00015;
    float showVal=min(1.,max(0.,(u_show*(1.+d*(u_length-1.)))-d*tParams.z));showVal=qinticInOut(showVal);
    float radius=mix(u_factor+tParams.x*3.,u_factor,showVal);
    vec3 pos=(texture2D(t_position,vec2(vUv.x*0.5,vUv.y*0.5)).xyz-0.5)*2.*radius;
    vec3 pos2=(texture2D(t_position,vec2(vUv.x*0.5+0.5,vUv.y*0.5)).xyz-0.5)*2.*radius;
    float d4=u_delay;
    pos=mix(pos,pos2,min(1.,max(0.,((u_progress*(1.+d4*(u_length-1.)))-d4*tParams2.x))));
    pos=mix(pos,pos*tParams3.x,min(1.,max(0.,u_explode*(1.+d3*(u_length-1.))-d3*tParams2.w)));
    vec4 tOtarget=texture2D(t_oTarget,vUv);vec4 tOVelocity=texture2D(t_oVelocity,vUv);
    float spring=u_spring+tParams.w;float friction=u_friction;
    vx=(tOVelocity.x+(pos.x-tOtarget.x)*spring)*friction;
    vy=(tOVelocity.y+(pos.y-tOtarget.y)*spring)*friction;
    vz=(tOVelocity.z+(pos.z-tOtarget.z)*spring)*friction;
  }
  gl_FragColor=vec4(vec3(vx,vy,vz),1.);
}`;

export const GRAIN_FRAGMENT = `precision highp float;
uniform float u_show;uniform float u_bright;uniform float u_alpha;uniform float u_scale;uniform float u_time;
varying vec2 vUv;
float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float pattern(){float s=sin(0.5),c=cos(0.5);vec2 center=vec2(random(vUv+u_time));vec2 tex=vUv*vec2(4096,4096)*u_scale-center;vec2 point=vec2(c*tex.x-s*tex.y,s*tex.x+c*tex.y);return(sin(point.x)*sin(point.y))*4.0;}
void main(){
  float dist=distance(vec2(0.5),vUv)*2.;
  vec4 black=vec4(0.,0.,0.,1.);
  float pat=pattern();
  vec4 grain=vec4(pat,pat,pat,u_alpha);grain.rgb*=u_bright;
  gl_FragColor=mix(grain,black,smoothstep(u_show-0.1,u_show+0.1,dist));
}`;

export const FRONT_VERTEX = `mat4 rotMat=rotationMatrix(vec3(a_angle.x,a_angle.y,a_angle.z),mod(a_angle.w*u_time*0.15,3.1416*2.));
vec4 mvPosition=vec4(transformed,1.0);
v_color=a_color;
#ifdef USE_INSTANCING
  mat4 instanceMat=instanceMatrix;
  float zFactor=map(instanceMat[3][2],0.,9.,0.5,0.2);
  instanceMat[3][0]=instanceMat[3][0]*u_resolution.x*zFactor-u_mouse.x*a_param.x+sin(u_time*a_param.w*0.5)*a_param.y*0.15;
  instanceMat[3][1]=instanceMat[3][1]*u_resolution.y*zFactor-u_mouse.y*a_param.x+cos(u_time*a_param.w*0.5)*a_param.z*0.15;
  instanceMat[0][0]=instanceMat[0][0]*u_scale;
  instanceMat[1][1]=instanceMat[1][1]*u_scale;
  instanceMat[2][2]=instanceMat[2][2]*u_scale;
  instanceMat*=rotMat;
  mvPosition=instanceMat*mvPosition;
#endif
mvPosition=modelViewMatrix*mvPosition;
gl_Position=projectionMatrix*mvPosition;`;

export const FRONT_FRAGMENT = `vec3 col=v_color.rgb;
#ifdef OPAQUE
diffuseColor.a=1.0;
#endif
outgoingLight.rgb=col.rgb;
diffuseColor.a*=v_color.a;
gl_FragColor=vec4(outgoingLight,diffuseColor.a);`;

export const BOKEH_VERTEX = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;

export const BOKEH_FRAGMENT = `#include <common>
varying vec2 vUv;
uniform sampler2D tColor;uniform sampler2D tDepth;uniform float textureWidth;uniform float textureHeight;
uniform float focalDepth;uniform float focalLength;uniform float fstop;uniform float znear;uniform float zfar;uniform float maxblur;uniform float threshold;uniform float gain;uniform float bias;uniform float fringe;uniform float dithering;
const int samples=SAMPLES;const int rings=RINGS;const int maxringsamples=rings*samples;
float CoC=0.03;
vec3 color(vec2 coords,float blur){vec3 col=vec3(0.0);vec2 texel=vec2(1.0/textureWidth,1.0/textureHeight);
  col.r=texture2D(tColor,coords+vec2(0.0,1.0)*texel*fringe*blur).r;col.g=texture2D(tColor,coords+vec2(-0.866,-0.5)*texel*fringe*blur).g;col.b=texture2D(tColor,coords+vec2(0.866,-0.5)*texel*fringe*blur).b;
  vec3 lumcoeff=vec3(0.299,0.587,0.114);float lum=dot(col.rgb,lumcoeff);float thresh=max((lum-threshold)*gain,0.0);return col+mix(vec3(0.0),col,thresh*blur);}
float linearize(float depth){return -zfar*znear/(depth*(zfar-znear)-zfar);}
float gather(float i,float j,int ringsamples,inout vec3 col,float w,float h,float blur){float rings2=float(rings);float step=PI*2.0/float(ringsamples);float pw=cos(j*step)*i;float ph=sin(j*step)*i;col+=color(vUv.xy+vec2(pw*w,ph*h),blur)*mix(1.0,i/rings2,bias);return mix(1.0,i/rings2,bias);}
void main(){
  float depth=linearize(texture2D(tDepth,vUv.xy).x);
  float f=focalLength;float d=focalDepth*1000.0;float o=depth*1000.0;
  float a=(o*f)/(o-f);float b=(d*f)/(d-f);float c=(d-f)/(d*fstop*CoC);
  float blur=clamp(abs(a-b)*c,0.0,1.0);
  vec2 noise=vec2(rand(vUv.xy),rand(vUv.xy+vec2(0.4,0.6)))*dithering*blur;
  float w=(1.0/textureWidth)*blur*maxblur+noise.x;float h=(1.0/textureHeight)*blur*maxblur+noise.y;
  vec3 col=texture2D(tColor,vUv.xy).rgb;
  if(blur>=0.05){float s=1.0;int ringsamples;
    for(int i=1;i<=rings;i++){ringsamples=i*samples;for(int j=0;j<maxringsamples;j++){if(j>=ringsamples)break;s+=gather(float(i),float(j),ringsamples,col,w,h,blur);}}
    col/=s;}
  gl_FragColor.rgb=col;gl_FragColor.a=1.0;
}`;
