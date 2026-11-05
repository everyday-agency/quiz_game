// Send real touch input rather than relying on platform-specific synthesized scrolling.
// Callers enable touch emulation, select a visible overflowing element, and assert
// that it scrolled without activating any surrounding answer button.
export async function swipeLeft(call, {x, y}, distance=140) {
  await call('Runtime.evaluate',{expression:'new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))',awaitPromise:true});
  const points=position=>[{id:1,x:position,y,radiusX:2,radiusY:2,force:1}];
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(x)});
  for(let step=1;step<=10;step++){
    await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:points(x-Math.min(distance,x-20)*step/10)});
    await new Promise(resolve=>setTimeout(resolve,20));
  }
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
}
