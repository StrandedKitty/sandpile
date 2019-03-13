var canvas = document.getElementById("canvas");
var range = document.getElementById("speed");
var rangeValue = document.getElementById("speedValue");
var width = 513;
var height = 513;
var scale = 0.5;
var dscale = 0.5;
var paused = false;
var speed = 5;
canvas.width = window.innerWidth*window.devicePixelRatio;
canvas.height = window.innerHeight*window.devicePixelRatio;
range.value = speed;
rangeValue.innerHTML = speed;
var targetTexture1, targetTexture2;
var fb1, fb2;
function main() {
	var gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}
	var program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
	var programFinal = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "final-fragment-shader"]);
	
	gl.useProgram(program);
	
	var positionLocation = gl.getAttribLocation(program, "a_position");
	var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	var imageLocation = gl.getUniformLocation(program, "u_image");
	var counterLocation = gl.getUniformLocation(program, "u_counter");
	gl.uniform2f(resolutionLocation, width, height);
	gl.uniform1i(imageLocation, 0);
	gl.uniform1i(counterLocation, 0);
	
	gl.useProgram(programFinal);
	
	var positionLocationFinal = gl.getAttribLocation(programFinal, "a_position");
	var texcoordLocationFinal = gl.getAttribLocation(programFinal, "a_texCoord");
	var resolutionLocationFinal = gl.getUniformLocation(programFinal, "u_resolution");
	var sizeLocationFinal = gl.getUniformLocation(programFinal, "u_size");
	var imageLocationFinal = gl.getUniformLocation(programFinal, "u_image");
	var scaleLocationFinal = gl.getUniformLocation(programFinal, "u_scale");
	var color1LocationFinal = gl.getUniformLocation(programFinal, "u_color1");
	var color2LocationFinal = gl.getUniformLocation(programFinal, "u_color2");
	var color3LocationFinal = gl.getUniformLocation(programFinal, "u_color3");
	gl.uniform1i(imageLocationFinal, 0);
	gl.uniform2f(resolutionLocationFinal, window.innerWidth*window.devicePixelRatio, window.innerHeight*window.devicePixelRatio);
	gl.uniform2f(sizeLocationFinal, width, height);
	
	gl.uniform3fv(color1LocationFinal, [255, 0, 104]);
	gl.uniform3fv(color2LocationFinal, [0, 234, 139]);
	gl.uniform3fv(color3LocationFinal, [57, 107, 255]);
	
	gl.useProgram(program);
	
	targetTexture1 = gl.createTexture();
	targetTexture2 = gl.createTexture();
	
	var buffer = new Uint8Array(width * height * 4);
	buffer[width*height*2] = 255;
	buffer[width*height*2-1] = 255;
	buffer[width*height*2-2] = 255;
	
	gl.bindTexture(gl.TEXTURE_2D, targetTexture1);
	var level = 0;
	var internalFormat = gl.RGBA;
	var border = 0;
	var format = gl.RGBA;
	var type = gl.UNSIGNED_BYTE;
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	gl.bindTexture(gl.TEXTURE_2D, targetTexture2);
	var level = 0;
	var internalFormat = gl.RGBA;
	var border = 0;
	var format = gl.RGBA;
	var type = gl.UNSIGNED_BYTE;
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, buffer);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	fb1 = gl.createFramebuffer();
	fb2 = gl.createFramebuffer();
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
	var attachmentPoint1 = gl.COLOR_ATTACHMENT0;
	gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint1, gl.TEXTURE_2D, targetTexture1, 0);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
	var attachmentPoint2 = gl.COLOR_ATTACHMENT0;
	gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint2, gl.TEXTURE_2D, targetTexture2, 0);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	gl.viewport(0, 0, width, height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	setRectangle(gl, -1, -1, 2, 2);
	
	var texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,	0.0,
		1.0,	0.0,
		0.0,	1.0,
		0.0,	1.0,
		1.0,	0.0,
		1.0,	1.0,
	]), gl.STATIC_DRAW);
	
	gl.enableVertexAttribArray(positionLocation);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
	gl.enableVertexAttribArray(texcoordLocation);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
	
	gl.useProgram(programFinal);
	
	var positionBufferFinal = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferFinal);
	setRectangle(gl, -1, -1, 2, 2);
	
	var texcoordBufferFinal = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBufferFinal);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,	0.0,
		1.0,	0.0,
		0.0,	1.0,
		0.0,	1.0,
		1.0,	0.0,
		1.0,	1.0,
	]), gl.STATIC_DRAW);
	
	gl.enableVertexAttribArray(positionLocationFinal);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferFinal);
	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(positionLocationFinal, size, type, normalize, stride, offset);
	gl.enableVertexAttribArray(texcoordLocationFinal);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBufferFinal);
	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(texcoordLocationFinal, size, type, normalize, stride, offset);
	
	draw();
	var counter = 0;
	function draw(){
		requestAnimationFrame(draw);
		
		scale += (dscale - scale)*0.5;
		
		gl.viewport(0, 0, width, height);
		gl.useProgram(program);
		if(!paused) {
			for(var i=0; i<speed; i++) {
				gl.uniform1i(counterLocation, counter);
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, counter%2 ? targetTexture1 : targetTexture2);
				gl.bindFramebuffer(gl.FRAMEBUFFER, counter%2 ? fb2 : fb1);
				gl.drawArrays(gl.TRIANGLES, 0, 6);
				
				counter++;
			}
		}
		
		gl.useProgram(programFinal);
		gl.useProgram(programFinal);
		gl.viewport(0, 0, window.innerWidth*window.devicePixelRatio, window.innerHeight*window.devicePixelRatio);
		gl.uniform2f(resolutionLocationFinal, window.innerWidth*window.devicePixelRatio, window.innerHeight*window.devicePixelRatio);
		gl.uniform1f(scaleLocationFinal, scale);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, counter%2 ? targetTexture1 : targetTexture2);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		
		document.getElementById("gen").innerHTML = counter;
	}
	
	window.addEventListener('resize', function(){
		canvas.width = window.innerWidth*window.devicePixelRatio;
		canvas.height = window.innerHeight*window.devicePixelRatio;
	});
	window.addEventListener("wheel", function(e){
		if(e.deltaY < 0) dscale *= 0.9;
		if(e.deltaY > 0) dscale *= 1.1;
	});
	document.body.onkeydown = function(e){
		if(e.keyCode == 32){
			paused = !paused;
		}
	}
	range.addEventListener("input", function() {
		speed = range.value;
		rangeValue.innerHTML = speed;
	}, false);
}

function setRectangle(gl, x, y, width, height) {
	var x1 = x;
	var x2 = x + width;
	var y1 = y;
	var y2 = y + height;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	 x1, y1,
	 x2, y1,
	 x1, y2,
	 x1, y2,
	 x2, y1,
	 x2, y2,
	]), gl.STATIC_DRAW);
}
main();