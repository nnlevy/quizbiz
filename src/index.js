export default {
  async fetch(request) {
    return new Response(`
<!DOCTYPE html>
<title>QuizBiz</title>
<h1>QuizBiz Hero</h1>
<p>This is the hero section.</p>
`, { headers: { 'Content-Type': 'text/html' } });
  }
};