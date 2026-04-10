export default {
  async fetch(request) {
    return new Response(`
<!DOCTYPE html>
<title>QuizBiz</title>
<h1>Quizbiz.org: AI-Powered Domain Studio</h1>
<section id="services">
<h2>Services</h2>
<p>Our AI services help you find and manage domains.</p>
</section>
<section id="lease">
<h2>Lease</h2>
<p>Lease domains for short-term use.</p>
</section>
`, { headers: { 'Content-Type': 'text/html' } });
  }
};