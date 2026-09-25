import React, { useEffect, useRef } from 'react';

export function NeuralNetworkBackground() {
 const canvasRef = useRef<HTMLCanvasElement>(null);

 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 let width = canvas.width = window.innerWidth;
 let height = canvas.height = window.innerHeight;
 
 // Create nodes (reduced count for better performance)
 const nodes = Array.from({ length: 40 }).map(() => ({
 x: Math.random() * width,
 y: Math.random() * height,
 vx: (Math.random() - 0.5) * 0.5,
 vy: (Math.random() - 0.5) * 0.5,
 radius: Math.random() * 2 + 1,
 }));

 let animationFrameId: number;

 const render = () => {
 ctx.clearRect(0, 0, width, height);
 
 // Update positions
 nodes.forEach(node => {
 node.x += node.vx;
 node.y += node.vy;

 if (node.x < 0 || node.x > width) node.vx *= -1;
 if (node.y < 0 || node.y > height) node.vy *= -1;
 });

 // Draw connections
 ctx.lineWidth = 0.5;
 for (let i = 0; i < nodes.length; i++) {
 for (let j = i + 1; j < nodes.length; j++) {
 const dx = nodes[i].x - nodes[j].x;
 const dy = nodes[i].y - nodes[j].y;
 const dist = Math.sqrt(dx * dx + dy * dy);

 if (dist < 150) {
 ctx.beginPath();
 ctx.strokeStyle = `rgba(15, 118, 110, ${1 - dist / 150})`; // primary emerald color faded
 ctx.moveTo(nodes[i].x, nodes[i].y);
 ctx.lineTo(nodes[j].x, nodes[j].y);
 ctx.stroke();
 }
 }
 }

 // Draw nodes
 nodes.forEach(node => {
 ctx.beginPath();
 ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
 ctx.fillStyle = 'rgba(15, 118, 110, 0.4)';
 ctx.fill();
 });

 animationFrameId = requestAnimationFrame(render);
 };

 render();

 const handleResize = () => {
 width = canvas.width = window.innerWidth;
 height = canvas.height = window.innerHeight;
 };
 window.addEventListener('resize', handleResize);

 return () => {
 cancelAnimationFrame(animationFrameId);
 window.removeEventListener('resize', handleResize);
 };
 }, []);

 return (
 <canvas 
 ref={canvasRef} 
 className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
 />
 );
}
