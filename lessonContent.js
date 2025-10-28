const courseContent = {
            "Python Basics": {
    intro: "Welcome to Python! Let's start with the simplest and most fun part - making Python talk to you!",
    lessons: [
        "Python is like having a conversation with your computer. The print() function is how Python talks back to you. Try typing: print('Hello, World!')",
        "You can print anything you want! Words (strings) go in quotes:\n\nprint('I love coding!')\nprint('My name is...')\nprint('Python is fun!')",
        "Python can also do math and show you the answer:\n\nprint(5 + 3)  # Shows: 8\nprint(10 - 2)  # Shows: 8\nprint(4 * 2)   # Shows: 8",
        "Want to print multiple things? Just separate them with commas:\n\nprint('The answer is:', 42)\nprint('I am', 10, 'years old')",
        "You can print multiple lines using \\n (new line):\n\nprint('First line\\nSecond line\\nThird line')",
        "Comments help you remember what your code does. Use # for comments:\n\n# This is a comment - Python ignores it\nprint('But this runs!')  # Comment after code",
        "Amazing! You've learned how to make Python talk. Ready to test your knowledge?"
    ],
    quiz: [
        {
            question: "What function do you use to display text in Python?",
            options: ["show()", "print()", "display()", "write()"],
            correct: 1
        },
        {
            question: "What goes around text (strings) in Python?",
            options: ["Parentheses ()", "Quotes '' or \"\"", "Brackets []", "Curly braces {}"],
            correct: 1
        },
        {
            question: "What does # do in Python?",
            options: ["Prints text", "Does math", "Creates a comment", "Ends the program"],
            correct: 2
        }
    ]
},
            "JS Fundamentals": {
                intro: "Welcome to JavaScript Fundamentals! Let's explore the language that powers the web.",
                lessons: [
                    "JavaScript is a versatile language that runs in browsers, enabling interactive web experiences. It's also used in server-side development with Node.js.",
                    "Variables can be declared with let, const, or var:\n\nlet age = 25;  // Can be reassigned\nconst name = 'John';  // Cannot be reassigned\nvar oldWay = 'deprecated';  // Avoid using",
                    "JavaScript data types include:\n- Number: 42 or 3.14\n- String: 'text'\n- Boolean: true/false\n- Array: [1, 2, 3]\n- Object: {key: 'value'}",
                    "Functions are reusable code blocks:\n\nfunction greet(name) {\n  return 'Hello ' + name;\n}\n\nconst result = greet('Alice');  // 'Hello Alice'",
                    "Arrow functions provide a shorter syntax:\n\nconst add = (a, b) => a + b;\nconst square = x => x * x;\n\nconsole.log(add(5, 3));  // 8",
                    "Template literals make string interpolation easy:\n\nconst name = 'Alice';\nconst age = 25;\nconst message = `${name} is ${age} years old`;",
                    "Excellent work! You understand JavaScript fundamentals. Test your knowledge!"
                ],
                quiz: [
                    {
                        question: "Which keyword creates a constant in JavaScript?",
                        options: ["var", "let", "const", "final"],
                        correct: 2
                    },
                    {
                        question: "What does console.log() do?",
                        options: ["Creates a variable", "Prints to console", "Defines a function", "Returns a value"],
                        correct: 1
                    },
                    {
                        question: "Which is the correct arrow function syntax?",
                        options: ["function() => {}", "() => {}", "=> () {}", "{}() =>"],
                        correct: 1
                    }
                ]
            },
            "React Basics": {
                intro: "Welcome to React! Learn how to build modern user interfaces with components.",
                lessons: [
                    "React is a JavaScript library for building UIs. It uses a component-based architecture where everything is a reusable component.",
                    "A simple React component:\n\nfunction Welcome() {\n  return <h1>Hello, World!</h1>;\n}\n\nComponents return JSX, which looks like HTML.",
                    "JSX is a syntax extension that combines JavaScript with HTML-like markup:\n\nconst element = <div className='container'>Content</div>;\n\nNote: Use className instead of class.",
                    "Props pass data to components:\n\nfunction Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n<Greeting name='Alice' />",
                    "Components can be composed:\n\nfunction App() {\n  return (\n    <div>\n      <Header />\n      <Main />\n      <Footer />\n    </div>\n  );\n}",
                    "React uses a virtual DOM for efficient updates. When state changes, React intelligently updates only what's necessary.",
                    "Perfect! You've learned React basics. Time for questions!"
                ],
                quiz: [
                    {
                        question: "What does JSX stand for?",
                        options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "Java XML"],
                        correct: 0
                    },
                    {
                        question: "How do you pass data to a React component?",
                        options: ["Variables", "Props", "States", "Functions"],
                        correct: 1
                    },
                    {
                        question: "What is the correct way to write a className in JSX?",
                        options: ["class='box'", "className='box'", "classname='box'", "Class='box'"],
                        correct: 1
                    }
                ]
            },
            "HTML Basics": {
                intro: "Welcome to HTML! Learn the foundation of every website.",
                lessons: [
                    "HTML (HyperText Markup Language) structures web content. Every website uses HTML as its foundation.",
                    "HTML uses tags:\n\n<tagname>Content</tagname>\n\nExample:\n<h1>My Heading</h1>\n<p>My paragraph</p>",
                    "Common HTML elements:\n\n<h1> to <h6>: Headings\n<p>: Paragraphs\n<a>: Links\n<img>: Images\n<div>: Containers",
                    "Creating links:\n\n<a href='https://example.com'>Click here</a>\n\nThe href attribute specifies the destination.",
                    "Adding images:\n\n<img src='photo.jpg' alt='Description'>\n\nAlt text describes the image for accessibility.",
                    "HTML document structure:\n\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page Title</title>\n  </head>\n  <body>\n    Content here\n  </body>\n</html>",
                    "Awesome! You know HTML basics. Ready for the quiz?"
                ],
                quiz: [
                    {
                        question: "Which tag creates a paragraph?",
                        options: ["<para>", "<p>", "<paragraph>", "<text>"],
                        correct: 1
                    },
                    {
                        question: "What does HTML stand for?",
                        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
                        correct: 0
                    },
                    {
                        question: "Which attribute is used in <img> for accessibility?",
                        options: ["title", "alt", "description", "text"],
                        correct: 1
                    }
                ]
            },
            "Java Fundamentals": {
                intro: "Welcome to Java! Master this powerful, object-oriented language.",
                lessons: [
                    "Java is a class-based, object-oriented language. It follows 'write once, run anywhere' philosophy through the JVM.",
                    "Every Java program starts with a class:\n\npublic class Hello {\n  public static void main(String[] args) {\n    System.out.println('Hello World');\n  }\n}",
                    "Variable declaration requires types:\n\nint age = 25;\nString name = 'John';\nboolean isStudent = true;\ndouble price = 9.99;",
                    "Java has primitive types (int, double, boolean, char) and reference types (String, arrays, objects).",
                    "Operators work similarly to other languages:\n\nint sum = 5 + 3;  // 8\nboolean result = (10 > 5);  // true\nString full = 'Hello' + ' ' + 'World';",
                    "System.out.println() prints output:\n\nSystem.out.println('Hello');  // With newline\nSystem.out.print('Hello');  // Without newline",
                    "Great! You understand Java fundamentals. Test yourself!"
                ],
                quiz: [
                    {
                        question: "Which method is the entry point of a Java program?",
                        options: ["start()", "main()", "run()", "begin()"],
                        correct: 1
                    },
                    {
                        question: "What is the correct way to declare an integer?",
                        options: ["int x = 5;", "integer x = 5;", "Int x = 5;", "var x = 5;"],
                        correct: 0
                    },
                    {
                        question: "Which prints output in Java?",
                        options: ["console.log()", "print()", "System.out.println()", "echo()"],
                        correct: 2
                    }
                ]
            }
        };
