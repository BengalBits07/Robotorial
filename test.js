/**
 * Automated Verification Test Suite for Real Content Sourcing & Branding
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('\n--- 1. Testing Primary Bengal Bits Logo from bengalbits.com ---');
const logoPath = path.join(ROOT_DIR, 'assets/bengalbits-logo.png');
assert(fs.existsSync(logoPath), 'assets/bengalbits-logo.png exists');

const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
assert(
  html.includes('src="assets/bengalbits-logo.png"') || html.includes("src='assets/bengalbits-logo.png'"),
  'Strictly uses logo from bengalbits.com as primary logo in navbar'
);
assert(
  html.includes('href="#hero"') && html.includes('brand-bengal-bits'),
  'Logo is properly anchored on the left and links to #hero'
);

console.log('\n--- 2. Testing Robotorial Section & Required Projects ---');
assert(
  html.includes('A ROBOTICS AND AUTOMATION CLUB OF BENGAL BITS') ||
  html.includes('A Robotics and Automation Club of Bengal Bits'),
  'Robotorial section clearly framed as robotics & automation club'
);
assert(html.includes('Smart Dustbin'), 'Populated with "Smart Dustbin"');
assert(html.includes('Obstacle Avoidance Car'), 'Populated with "Obstacle Avoidance Car"');
assert(html.includes('Human Following Car'), 'Populated with "Human Following Car"');
assert(html.includes('Sensor Integration'), 'Populated with "Sensor Integration" details');

console.log('\n--- 3. Testing Content Sourcing (No Placeholders or Lorem Ipsum) ---');
assert(!html.toLowerCase().includes('lorem ipsum'), 'Does NOT contain "Lorem Ipsum"');
assert(!html.toLowerCase().includes('placeholder text'), 'Does NOT contain fake placeholder text');
assert(
  html.includes('Pioneering the next generation of intelligent robotics systems that reshape industries and enhance human capabilities'),
  'Contains exact mission statement extracted from live site'
);
assert(html.includes('Future in Motion'), 'Contains live tagline "Future in Motion"');

console.log('\n--- 4. Testing Real Team Profiles Sourced from Live Site ---');
const realTeam = [
  { name: 'Tanisha Seal', role: 'CEO' },
  { name: 'Tanya Singh', role: 'CO-FOUNDER' },
  { name: 'Arup Banerjee', role: 'LEAD STUDENT MENTOR' },
  { name: 'Pritam Panja', role: 'FINANCE MANAGER' },
  { name: 'Prithwi Biswas', role: 'MANAGEMENT HEAD' },
  { name: 'Samapti Gun', role: 'STUDENT MENTOR' },
  { name: 'Sachi Riya', role: 'STUDENT MENTOR' },
  { name: 'Kriti Gupta', role: 'STUDENT MENTOR' }
];

realTeam.forEach((member) => {
  assert(html.includes(member.name), `Real team member present: ${member.name}`);
  assert(html.includes(member.role), `Role present for ${member.name}: ${member.role}`);
});

console.log('\n--- 5. Testing Real Contact & Organization Data ---');
assert(html.includes('robotorial.bb@gmail.com'), 'Contains real email: robotorial.bb@gmail.com');
assert(html.includes('+91 89021 59596'), 'Contains real phone: +91 89021 59596');
assert(html.includes('Budge Budge') && html.includes('Kolkata'), 'Contains Budge Budge, Kolkata address');
assert(html.includes('https://forms.gle/6Ccgp2iqodxVhiXv8'), 'Contains live Google Query Form link');

console.log('\n--- 6. Testing Hands-on Hardware Streamlining & bengalbits.com Gallery ---');
assert(!html.includes('Dimensions &amp; Weight') && !html.includes('Dimensions & Weight'), 'Removed "Dimensions & Weight" as requested');
assert(!html.includes('Enroll in Kit Lab'), 'Removed "Enroll in Kit Lab" as requested');
assert(html.includes('From Our Gallery') || html.includes('BENGAL BITS &amp; ROBOTORIAL GALLERY'), 'Contains Gallery Section');
assert(html.includes('img4_vkibzm.jpg'), 'Contains real project photo from bengalbits.com (img4_vkibzm.jpg)');
assert(html.includes('ws1_a0ifqk.jpg'), 'Contains real workshop gallery photo from bengalbits.com (ws1_a0ifqk.jpg)');
assert(html.includes('ws2_q8jwhh.jpg'), 'Contains real rover testing photo from bengalbits.com (ws2_q8jwhh.jpg)');
assert(html.includes('img2_lrkvp6.jpg'), 'Contains real classroom gallery photo from bengalbits.com (img2_lrkvp6.jpg)');

console.log('\n--- 7. Testing bb.labs Hero Robot Image ---');
assert(fs.existsSync(path.join(ROOT_DIR, 'assets/hero-robot.png')), 'assets/hero-robot.png exists');
assert(html.includes('assets/hero-robot.png'), 'bb.labs card uses given hero-robot.png');

console.log('\n==========================================');
if (failures === 0) {
  console.log('🎉 ALL REAL DATA & BRANDING TESTS PASSED!');
  process.exit(0);
} else {
  console.error(`💥 ${failures} TEST(S) FAILED.`);
  process.exit(1);
}
