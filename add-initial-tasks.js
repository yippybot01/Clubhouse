// Run this in browser console at http://localhost:3000 (Tasks tab)
// Or paste into the browser DevTools console

const tasks = [
    "Work on sample/biz cards to be able to pass out.",
    "Follow up with Micah&Sean",
    "Setup Amazon",
    "Upload images to a folder for Cowork to post using buffer to twitter",
    "Resize the clips so we can post to see how they look",
    "Send Micah Some Mango Samples",
    "Schedule call with Bauman with Jack",
    "Create a prompt Dashboard Repository for all the most effective openclaw prompts.",
    "Create financial analysis for Yippy",
    "Offer to micah - first 3 months - earnout to equity",
    "Ask Bauman about running his as an ad",
    "Create slideshow for micah",
    "Create a Mike@yippypouches.com",
    "Email Tristan with our feedback on samples",
    "Send out Weekly Gol Recap post",
    "Make 10 Twitter replies",
    "Complete 10 samples/Tiktok orders through USPS"
];

const COLORS = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];

// Load existing todos
let todos = [];
const saved = localStorage.getItem('clubhouse_todos');
if (saved) {
    todos = JSON.parse(saved);
}

// Add new tasks
const now = Date.now();
tasks.forEach((taskText, index) => {
    const newTodo = {
        id: now + index,
        text: taskText,
        color: COLORS[index % COLORS.length],
        completed: false,
        createdAt: now + index,
        completedAt: null
    };
    todos.push(newTodo);
});

// Save back to localStorage
localStorage.setItem('clubhouse_todos', JSON.stringify(todos));

console.log(`✅ Added ${tasks.length} tasks to your to-do list!`);
console.log('Refresh the page to see them.');

// Auto-refresh if on the tasks tab
if (typeof renderTodos === 'function') {
    renderTodos();
    console.log('✅ Tasks rendered!');
}
