// Script to generate placeholder images for team members
// Run this in your browser's console or save as HTML file

function generatePlaceholder(name, filename) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background (matching USTP colors)
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, '#8B1E3F'); // USTP Maroon
    gradient.addColorStop(1, '#C49A6A'); // USTP Gold
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);
    
    // Add initials
    const initials = name.split(' ').map(n => n[0]).join('');
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 200, 200);
    
    // Add name below
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(name, 200, 280);
    
    // Convert to data URL and trigger download
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
}

// Generate placeholders for all team members
const teamMembers = [
    { name: "Dr. Venessa Garcia", file: "venessa-garcia.jpg" },
    { name: "Engr. Gladdy Christie Compasan", file: "gladdy-christie-compasan.jpg" },
    { name: "Ms. Flora Monica Mabaylan", file: "flora-monica-mabaylan.jpg" },
    { name: "Ms. Rhea Suzette Haguisan", file: "rhea-suzette-haguisan.jpg" },
    { name: "Engr. Jodie Rey Fernandez", file: "jodie-rey-fernandez.jpg" },
    { name: "Engr. Clark Darwin Gozon", file: "clark-darwin-gozon.jpg" },
    { name: "Engr. Mark Lister Nalupa", file: "mark-lister-nalupa.jpg" },
    { name: "Noreza P. Aleno", file: "noreza-aleno.jpg" },
    { name: "Krystia Ces G. Napili", file: "krystia-ces-napili.jpg" },
    { name: "Michael J. Cerbito", file: "michael-cerbito.jpg" }
];

// Uncomment the line below to generate all placeholders
// teamMembers.forEach(member => generatePlaceholder(member.name, member.file));

console.log("To generate placeholder images, uncomment the last line in this script and run it in your browser console.");
console.log("Or copy this code into an HTML file and open it in your browser.");