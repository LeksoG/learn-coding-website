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
            },
            "Variables & Types": {
                intro: "Let's dive deeper into Python variables and data types!",
                lessons: [
                    "Variables are containers that hold data. Think of them as labeled boxes where you store information.",
                    "Creating variables is simple:\n\nname = 'Alice'\nage = 25\nheight = 5.6\nis_student = True",
                    "Python has several data types:\n- Strings: 'text'\n- Integers: 42\n- Floats: 3.14\n- Booleans: True/False\n- Lists: [1, 2, 3]\n- Dictionaries: {'key': 'value'}",
                    "You can check a variable's type:\n\ntype(42)  # <class 'int'>\ntype('hello')  # <class 'str'>\ntype(3.14)  # <class 'float'>",
                    "Type conversion is easy:\n\nstr(42)  # '42'\nint('42')  # 42\nfloat('3.14')  # 3.14",
                    "Variables can be reassigned:\n\nx = 10\nprint(x)  # 10\nx = 20\nprint(x)  # 20",
                    "Perfect! You now understand variables and types!"
                ],
                quiz: [
                    {
                        question: "Which is the correct way to create a variable?",
                        options: ["int x = 5", "var x = 5", "x = 5", "let x = 5"],
                        correct: 2
                    },
                    {
                        question: "What type is the value 3.14?",
                        options: ["int", "float", "string", "decimal"],
                        correct: 1
                    },
                    {
                        question: "How do you convert a string to an integer?",
                        options: ["str()", "int()", "float()", "convert()"],
                        correct: 1
                    }
                ]
            },
            "Control Flow": {
                intro: "Learn to make decisions and repeat actions in your code!",
                lessons: [
                    "Control flow lets your program make decisions using if statements.",
                    "Basic if statement:\n\nage = 18\nif age >= 18:\n    print('You are an adult')",
                    "Add else for alternatives:\n\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')",
                    "Use elif for multiple conditions:\n\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelse:\n    print('C')",
                    "For loops repeat code:\n\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4",
                    "While loops continue until false:\n\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1",
                    "Excellent! You've mastered control flow!"
                ],
                quiz: [
                    {
                        question: "Which keyword is used for multiple conditions?",
                        options: ["elseif", "elif", "else if", "elsif"],
                        correct: 1
                    },
                    {
                        question: "What does range(5) produce?",
                        options: ["1 to 5", "0 to 5", "0 to 4", "1 to 4"],
                        correct: 2
                    },
                    {
                        question: "When does a while loop stop?",
                        options: ["Never", "After 10 iterations", "When condition is False", "At midnight"],
                        correct: 2
                    }
                ]
            },
            "Functions": {
                intro: "Functions help you organize and reuse code efficiently!",
                lessons: [
                    "Functions are reusable blocks of code that perform specific tasks.",
                    "Define a function with def:\n\ndef greet():\n    print('Hello!')\n\ngreet()  # Call the function",
                    "Functions can take parameters:\n\ndef greet(name):\n    print(f'Hello, {name}!')\n\ngreet('Alice')  # Hello, Alice!",
                    "Functions can return values:\n\ndef add(a, b):\n    return a + b\n\nresult = add(5, 3)  # 8",
                    "Default parameters:\n\ndef greet(name='Guest'):\n    print(f'Hello, {name}!')\n\ngreet()  # Hello, Guest!",
                    "Functions make code modular and easier to maintain. Use them to avoid repeating code!",
                    "Fantastic! You're now a functions expert!"
                ],
                quiz: [
                    {
                        question: "How do you define a function in Python?",
                        options: ["function name():", "def name():", "func name():", "define name():"],
                        correct: 1
                    },
                    {
                        question: "What keyword returns a value from a function?",
                        options: ["return", "send", "output", "give"],
                        correct: 0
                    },
                    {
                        question: "Can a function have default parameters?",
                        options: ["No", "Yes", "Only in Python 3", "Only integers"],
                        correct: 1
                    }
                ]
            },
            "Data Structures": {
                intro: "Master Python's powerful data structures!",
                lessons: [
                    "Lists store multiple items in order:\n\nfruits = ['apple', 'banana', 'orange']\nprint(fruits[0])  # apple",
                    "Add to lists:\n\nfruits.append('grape')\nfruits.insert(0, 'mango')",
                    "Dictionaries store key-value pairs:\n\nperson = {\n    'name': 'Alice',\n    'age': 25,\n    'city': 'NYC'\n}",
                    "Access dictionary values:\n\nprint(person['name'])  # Alice\nprint(person.get('age'))  # 25",
                    "Tuples are immutable lists:\n\ncoordinates = (10, 20)\nx, y = coordinates  # Unpacking",
                    "Sets store unique values:\n\nnumbers = {1, 2, 3, 3, 2}\nprint(numbers)  # {1, 2, 3}",
                    "Amazing! You've mastered data structures!"
                ],
                quiz: [
                    {
                        question: "How do you access the first item in a list?",
                        options: ["list[1]", "list[0]", "list.first()", "list(0)"],
                        correct: 1
                    },
                    {
                        question: "What makes a tuple different from a list?",
                        options: ["Faster", "Immutable", "Smaller", "Uses ()"],
                        correct: 1
                    },
                    {
                        question: "What do dictionaries store?",
                        options: ["Only numbers", "Key-value pairs", "Only strings", "Lists"],
                        correct: 1
                    }
                ]
            },
            "File Handling": {
                intro: "Learn to read and write files in Python!",
                lessons: [
                    "Files let you save and load data permanently.",
                    "Open a file for reading:\n\nwith open('file.txt', 'r') as f:\n    content = f.read()\n    print(content)",
                    "Write to a file:\n\nwith open('file.txt', 'w') as f:\n    f.write('Hello, World!')",
                    "Append to a file:\n\nwith open('file.txt', 'a') as f:\n    f.write('\\nNew line')",
                    "Read lines one by one:\n\nwith open('file.txt', 'r') as f:\n    for line in f:\n        print(line.strip())",
                    "Always use 'with' - it automatically closes files!",
                    "Perfect! You can now work with files!"
                ],
                quiz: [
                    {
                        question: "Which mode opens a file for reading?",
                        options: ["'w'", "'r'", "'a'", "'x'"],
                        correct: 1
                    },
                    {
                        question: "What does 'with' do?",
                        options: ["Writes data", "Automatically closes file", "Reads faster", "Creates directory"],
                        correct: 1
                    },
                    {
                        question: "Which mode appends to a file?",
                        options: ["'r'", "'w'", "'a'", "'add'"],
                        correct: 2
                    }
                ]
            },
            "Functions": {
                intro: "Master JavaScript functions - regular and arrow functions!",
                lessons: [
                    "Functions are reusable blocks of code in JavaScript.",
                    "Regular function:\n\nfunction add(a, b) {\n  return a + b;\n}\n\nconst result = add(5, 3);  // 8",
                    "Arrow functions provide shorter syntax:\n\nconst add = (a, b) => a + b;\nconst square = x => x * x;",
                    "Functions as first-class citizens:\n\nconst numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);",
                    "Callback functions:\n\nsetTimeout(() => {\n  console.log('Hello!');\n}, 1000);",
                    "Function parameters can have defaults:\n\nfunction greet(name = 'Guest') {\n  return `Hello, ${name}!`;\n}",
                    "Excellent! You understand JavaScript functions!"
                ],
                quiz: [
                    {
                        question: "Which is valid arrow function syntax?",
                        options: ["=> (x) x * 2", "(x) => x * 2", "x => * 2", "x -> x * 2"],
                        correct: 1
                    },
                    {
                        question: "What are first-class functions?",
                        options: ["Fastest functions", "Functions as values", "Built-in functions", "Top-level functions"],
                        correct: 1
                    },
                    {
                        question: "How do you set a default parameter?",
                        options: ["param = value", "param: value", "default param value", "param || value"],
                        correct: 0
                    }
                ]
            },
            "DOM Manipulation": {
                intro: "Learn to interact with HTML elements using JavaScript!",
                lessons: [
                    "The DOM (Document Object Model) represents your HTML as a tree of objects.",
                    "Select elements:\n\nconst element = document.getElementById('myId');\nconst elements = document.querySelectorAll('.myClass');",
                    "Change content:\n\nelement.textContent = 'New text';\nelement.innerHTML = '<b>Bold text</b>';",
                    "Change styles:\n\nelement.style.color = 'red';\nelement.style.fontSize = '20px';",
                    "Add/remove classes:\n\nelement.classList.add('active');\nelement.classList.remove('hidden');\nelement.classList.toggle('selected');",
                    "Create and append elements:\n\nconst newDiv = document.createElement('div');\nnewDiv.textContent = 'Hello';\ndocument.body.appendChild(newDiv);",
                    "Perfect! You can now manipulate the DOM!"
                ],
                quiz: [
                    {
                        question: "How do you select an element by ID?",
                        options: ["document.getById()", "document.getElementById()", "document.select()", "document.find()"],
                        correct: 1
                    },
                    {
                        question: "Which property changes element text safely?",
                        options: ["innerHTML", "textContent", "innerText", "text"],
                        correct: 1
                    },
                    {
                        question: "How do you toggle a CSS class?",
                        options: ["element.toggle('class')", "element.class.toggle()", "element.classList.toggle('class')", "element.toggleClass()"],
                        correct: 2
                    }
                ]
            },
            "Events": {
                intro: "Master event handling to make your websites interactive!",
                lessons: [
                    "Events let you respond to user interactions like clicks, typing, and scrolling.",
                    "Add event listeners:\n\nconst button = document.querySelector('button');\nbutton.addEventListener('click', () => {\n  console.log('Clicked!');\n});",
                    "Common events:\n- click: Mouse click\n- input: Text input change\n- submit: Form submission\n- keypress: Key pressed",
                    "Event object contains information:\n\nbutton.addEventListener('click', (event) => {\n  console.log(event.target);\n  event.preventDefault();\n});",
                    "Remove event listeners:\n\nconst handler = () => console.log('Clicked');\nbutton.addEventListener('click', handler);\nbutton.removeEventListener('click', handler);",
                    "Event delegation for dynamic content:\n\nparent.addEventListener('click', (e) => {\n  if (e.target.matches('.item')) {\n    // Handle item click\n  }\n});",
                    "Awesome! You're an event handling expert!"
                ],
                quiz: [
                    {
                        question: "How do you add an event listener?",
                        options: ["element.on('click', fn)", "element.addEventListener('click', fn)", "element.click(fn)", "element.onClick(fn)"],
                        correct: 1
                    },
                    {
                        question: "What does preventDefault() do?",
                        options: ["Stops propagation", "Removes listener", "Prevents default behavior", "Pauses execution"],
                        correct: 2
                    },
                    {
                        question: "Which event fires when typing in an input?",
                        options: ["change", "input", "keypress", "type"],
                        correct: 1
                    }
                ]
            },
            "Async JavaScript": {
                intro: "Master asynchronous JavaScript with Promises and async/await!",
                lessons: [
                    "Asynchronous code doesn't block execution - it runs in the background.",
                    "Promises represent future values:\n\nconst promise = fetch('https://api.example.com');\npromise.then(response => response.json())\n       .then(data => console.log(data));",
                    "Handle errors with catch:\n\nfetch('/api')\n  .then(res => res.json())\n  .catch(err => console.error(err));",
                    "Async/await makes promises cleaner:\n\nasync function getData() {\n  try {\n    const res = await fetch('/api');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}",
                    "Promise.all runs multiple promises:\n\nconst [data1, data2] = await Promise.all([\n  fetch('/api1'),\n  fetch('/api2')\n]);",
                    "setTimeout for delayed execution:\n\nsetTimeout(() => {\n  console.log('After 2 seconds');\n}, 2000);",
                    "Incredible! You've mastered async JavaScript!"
                ],
                quiz: [
                    {
                        question: "What does async function return?",
                        options: ["Callback", "Promise", "Value", "Undefined"],
                        correct: 1
                    },
                    {
                        question: "Where can you use await?",
                        options: ["Anywhere", "Only in async functions", "Only in loops", "In callbacks"],
                        correct: 1
                    },
                    {
                        question: "What does Promise.all() do?",
                        options: ["Runs promises sequentially", "Runs first promise", "Waits for all promises", "Cancels promises"],
                        correct: 2
                    }
                ]
            },
            "State & Props": {
                intro: "Master React state and props for dynamic components!",
                lessons: [
                    "Props pass data from parent to child components - they're read-only.",
                    "Using props:\n\nfunction Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n<Greeting name='Alice' />",
                    "State holds component data that can change:\n\nimport { useState } from 'react';\n\nconst [count, setCount] = useState(0);",
                    "Update state triggers re-render:\n\n<button onClick={() => setCount(count + 1)}>\n  Count: {count}\n</button>",
                    "Multiple state variables:\n\nconst [name, setName] = useState('');\nconst [age, setAge] = useState(0);",
                    "Props vs State: Props come from parent (immutable), State is internal (mutable).",
                    "Perfect! You understand React state and props!"
                ],
                quiz: [
                    {
                        question: "Can you modify props directly?",
                        options: ["Yes", "No", "Only in parent", "Only numbers"],
                        correct: 1
                    },
                    {
                        question: "How do you create state?",
                        options: ["createState()", "useState()", "setState()", "state()"],
                        correct: 1
                    },
                    {
                        question: "What happens when state changes?",
                        options: ["Nothing", "Component re-renders", "Page reloads", "Error occurs"],
                        correct: 1
                    }
                ]
            },
            "Hooks": {
                intro: "Master React Hooks - useState, useEffect, and more!",
                lessons: [
                    "Hooks let you use state and React features in function components.",
                    "useState for state:\n\nconst [count, setCount] = useState(0);\nsetCount(count + 1);",
                    "useEffect for side effects:\n\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);",
                    "Cleanup in useEffect:\n\nuseEffect(() => {\n  const timer = setInterval(() => {}, 1000);\n  return () => clearInterval(timer);\n}, []);",
                    "useEffect dependency array:\n- [] runs once on mount\n- [dep] runs when dep changes\n- no array runs every render",
                    "Custom hooks reuse logic:\n\nfunction useCounter() {\n  const [count, setCount] = useState(0);\n  return { count, increment: () => setCount(c => c + 1) };\n}",
                    "Excellent! You've mastered React Hooks!"
                ],
                quiz: [
                    {
                        question: "When does useEffect with [] run?",
                        options: ["Every render", "Never", "Once on mount", "On unmount"],
                        correct: 2
                    },
                    {
                        question: "What does useEffect cleanup return?",
                        options: ["Value", "Function", "Promise", "Component"],
                        correct: 1
                    },
                    {
                        question: "Can you create custom hooks?",
                        options: ["No", "Yes", "Only in React 18", "Only class components"],
                        correct: 1
                    }
                ]
            },
            "React Router": {
                intro: "Learn to add navigation to your React applications!",
                lessons: [
                    "React Router enables navigation between different views in your app.",
                    "Basic setup:\n\nimport { BrowserRouter, Routes, Route } from 'react-router-dom';\n\n<BrowserRouter>\n  <Routes>\n    <Route path='/' element={<Home />} />\n    <Route path='/about' element={<About />} />\n  </Routes>\n</BrowserRouter>",
                    "Link component for navigation:\n\nimport { Link } from 'react-router-dom';\n\n<Link to='/about'>About</Link>",
                    "useNavigate hook for programmatic navigation:\n\nconst navigate = useNavigate();\nnavigate('/home');",
                    "URL parameters:\n\n<Route path='/user/:id' element={<User />} />\n\nconst { id } = useParams();",
                    "Nested routes:\n\n<Route path='/dashboard' element={<Dashboard />}>\n  <Route path='settings' element={<Settings />} />\n</Route>",
                    "Great! You can now add routing to React apps!"
                ],
                quiz: [
                    {
                        question: "Which component wraps your app for routing?",
                        options: ["Router", "BrowserRouter", "RouteProvider", "Navigation"],
                        correct: 1
                    },
                    {
                        question: "How do you navigate programmatically?",
                        options: ["useNavigate()", "navigate()", "useRouter()", "goTo()"],
                        correct: 0
                    },
                    {
                        question: "How do you get URL parameters?",
                        options: ["useParams()", "getParams()", "urlParams()", "props.params"],
                        correct: 0
                    }
                ]
            },
            "Context API": {
                intro: "Learn global state management with Context API!",
                lessons: [
                    "Context provides a way to pass data through the component tree without props drilling.",
                    "Create context:\n\nimport { createContext } from 'react';\n\nconst ThemeContext = createContext('light');",
                    "Provide context value:\n\n<ThemeContext.Provider value='dark'>\n  <App />\n</ThemeContext.Provider>",
                    "Consume context:\n\nimport { useContext } from 'react';\n\nconst theme = useContext(ThemeContext);",
                    "Custom context hook:\n\nfunction useTheme() {\n  const context = useContext(ThemeContext);\n  if (!context) throw new Error('useTheme must be used within ThemeProvider');\n  return context;\n}",
                    "Context is perfect for themes, user auth, and global settings!",
                    "Perfect! You've mastered Context API!"
                ],
                quiz: [
                    {
                        question: "How do you create context?",
                        options: ["useContext()", "createContext()", "newContext()", "Context()"],
                        correct: 1
                    },
                    {
                        question: "Which component provides context value?",
                        options: ["Context.Provider", "ContextProvider", "Provider", "Context.Provide"],
                        correct: 0
                    },
                    {
                        question: "How do you consume context?",
                        options: ["getContext()", "readContext()", "useContext()", "consumeContext()"],
                        correct: 2
                    }
                ]
            },
            "React Performance": {
                intro: "Optimize your React apps for maximum performance!",
                lessons: [
                    "React performance optimization prevents unnecessary re-renders.",
                    "React.memo prevents re-render if props haven't changed:\n\nconst MyComponent = React.memo((props) => {\n  return <div>{props.value}</div>;\n});",
                    "useMemo caches expensive calculations:\n\nconst expensiveValue = useMemo(() => {\n  return computeExpensiveValue(a, b);\n}, [a, b]);",
                    "useCallback memoizes functions:\n\nconst handleClick = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);",
                    "Lazy loading components:\n\nconst LazyComponent = lazy(() => import('./Component'));\n\n<Suspense fallback={<Loading />}>\n  <LazyComponent />\n</Suspense>",
                    "Key prop for efficient list rendering:\n\n{items.map(item => (\n  <Item key={item.id} data={item} />\n))}",
                    "Amazing! You're a React performance expert!"
                ],
                quiz: [
                    {
                        question: "What does React.memo do?",
                        options: ["Stores state", "Prevents unnecessary re-renders", "Caches API calls", "Improves CSS"],
                        correct: 1
                    },
                    {
                        question: "When should you use useMemo?",
                        options: ["Always", "For expensive calculations", "Never", "For all variables"],
                        correct: 1
                    },
                    {
                        question: "What's the purpose of the key prop?",
                        options: ["Styling", "Security", "Efficient list rendering", "State management"],
                        correct: 2
                    }
                ]
            },
            "CSS Styling": {
                intro: "Master CSS to make your websites beautiful!",
                lessons: [
                    "CSS styles your HTML elements with colors, sizes, and layouts.",
                    "Basic selector and properties:\n\np {\n  color: blue;\n  font-size: 16px;\n  margin: 10px;\n}",
                    "Class selectors:\n\n.button {\n  background: #007bff;\n  padding: 10px 20px;\n  border-radius: 5px;\n}",
                    "ID selectors:\n\n#header {\n  background: #333;\n  color: white;\n}",
                    "Box model:\n\n.box {\n  width: 200px;\n  padding: 20px;      /* Inside space */\n  border: 2px solid;  /* Border */\n  margin: 10px;       /* Outside space */\n}",
                    "Colors and backgrounds:\n\n.card {\n  background: linear-gradient(45deg, #ff6b6b, #feca57);\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}",
                    "Fantastic! You can now style websites!"
                ],
                quiz: [
                    {
                        question: "How do you select a class in CSS?",
                        options: ["#className", ".className", "@className", "className"],
                        correct: 1
                    },
                    {
                        question: "What's the order of the box model from inside out?",
                        options: ["margin, border, padding", "padding, border, margin", "border, padding, margin", "padding, margin, border"],
                        correct: 1
                    },
                    {
                        question: "Which property changes text color?",
                        options: ["text-color", "font-color", "color", "text"],
                        correct: 2
                    }
                ]
            },
            "Flexbox & Grid": {
                intro: "Master modern CSS layouts with Flexbox and Grid!",
                lessons: [
                    "Flexbox creates flexible one-dimensional layouts (row or column).",
                    "Basic flexbox:\n\n.container {\n  display: flex;\n  justify-content: center;  /* Horizontal */\n  align-items: center;      /* Vertical */\n  gap: 10px;\n}",
                    "Flex direction:\n\n.row { flex-direction: row; }\n.column { flex-direction: column; }",
                    "Flex item properties:\n\n.item {\n  flex: 1;           /* Grow to fill space */\n  flex-shrink: 0;    /* Don't shrink */\n}",
                    "Grid creates two-dimensional layouts:\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}",
                    "Grid areas:\n\n.layout {\n  grid-template-areas:\n    'header header header'\n    'sidebar main main'\n    'footer footer footer';\n}",
                    "Perfect! You've mastered modern layouts!"
                ],
                quiz: [
                    {
                        question: "What does justify-content do in flexbox?",
                        options: ["Vertical alignment", "Horizontal alignment", "Text alignment", "Border alignment"],
                        correct: 1
                    },
                    {
                        question: "Which is two-dimensional?",
                        options: ["Flexbox", "Grid", "Both", "Neither"],
                        correct: 1
                    },
                    {
                        question: "What does 'fr' mean in grid?",
                        options: ["Frame", "Fraction", "Fixed ratio", "Free"],
                        correct: 1
                    }
                ]
            },
            "Responsive Design": {
                intro: "Make your websites look great on all devices!",
                lessons: [
                    "Responsive design adapts layouts to different screen sizes.",
                    "Viewport meta tag (in HTML):\n\n<meta name='viewport' content='width=device-width, initial-scale=1'>",
                    "Media queries:\n\n@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}",
                    "Mobile-first approach:\n\n/* Mobile styles first */\n.card { width: 100%; }\n\n/* Then desktop */\n@media (min-width: 768px) {\n  .card { width: 50%; }\n}",
                    "Responsive units:\n\n.text {\n  font-size: 1rem;    /* Relative to root */\n  padding: 2em;       /* Relative to font-size */\n  width: 50vw;        /* 50% of viewport width */\n}",
                    "Flexible images:\n\nimg {\n  max-width: 100%;\n  height: auto;\n}",
                    "Excellent! Your sites now work on all devices!"
                ],
                quiz: [
                    {
                        question: "What's the mobile-first approach?",
                        options: ["Desktop first", "Mobile styles first", "Tablet first", "All at once"],
                        correct: 1
                    },
                    {
                        question: "Which unit is relative to viewport width?",
                        options: ["em", "rem", "vw", "px"],
                        correct: 2
                    },
                    {
                        question: "What does max-width: 768px target?",
                        options: ["Screens wider than 768px", "Screens narrower than 768px", "Exactly 768px", "All screens"],
                        correct: 1
                    }
                ]
            },
            "CSS Animations": {
                intro: "Bring your websites to life with CSS animations!",
                lessons: [
                    "CSS animations create smooth visual effects without JavaScript.",
                    "Transitions:\n\n.button {\n  transition: all 0.3s ease;\n}\n\n.button:hover {\n  transform: scale(1.1);\n  background: blue;\n}",
                    "Keyframe animations:\n\n@keyframes slideIn {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(0); }\n}\n\n.box {\n  animation: slideIn 0.5s ease;\n}",
                    "Animation properties:\n\n.box {\n  animation-name: bounce;\n  animation-duration: 1s;\n  animation-timing-function: ease-in-out;\n  animation-iteration-count: infinite;\n}",
                    "Transform properties:\n\n.item {\n  transform: rotate(45deg);\n  transform: scale(1.5);\n  transform: translateX(100px);\n}",
                    "Multiple animations:\n\n.box {\n  animation:\n    fadeIn 0.5s ease,\n    slideUp 0.5s ease 0.2s;\n}",
                    "Amazing! You've mastered CSS animations!"
                ],
                quiz: [
                    {
                        question: "Which creates gradual changes?",
                        options: ["animation", "transition", "transform", "keyframe"],
                        correct: 1
                    },
                    {
                        question: "What does @keyframes define?",
                        options: ["Colors", "Animation steps", "Transitions", "Transforms"],
                        correct: 1
                    },
                    {
                        question: "What does transform: scale(2) do?",
                        options: ["Rotates", "Doubles size", "Moves", "Fades"],
                        correct: 1
                    }
                ]
            },
            "Advanced CSS": {
                intro: "Master advanced CSS techniques like Sass and CSS variables!",
                lessons: [
                    "CSS variables (custom properties):\n\n:root {\n  --primary-color: #007bff;\n  --spacing: 16px;\n}\n\n.button {\n  background: var(--primary-color);\n  padding: var(--spacing);\n}",
                    "Sass variables and nesting:\n\n$primary: #007bff;\n\n.card {\n  background: $primary;\n  \n  &:hover {\n    background: darken($primary, 10%);\n  }\n}",
                    "CSS functions:\n\n.box {\n  width: calc(100% - 40px);\n  background: rgb(255, 0, 0);\n  filter: brightness(1.2);\n}",
                    "Pseudo-elements:\n\n.quote::before {\n  content: '\"';\n  font-size: 2em;\n}\n\n.link::after {\n  content: ' →';\n}",
                    "CSS Grid advanced:\n\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  grid-auto-rows: 200px;\n}",
                    "Modern selectors:\n\n.item:not(.active) { }\n.item:nth-child(3n) { }\n.parent:has(.child) { }",
                    "Incredible! You're a CSS master!"
                ],
                quiz: [
                    {
                        question: "How do you define a CSS variable?",
                        options: ["var(--name)", "--name:", "$name:", "@name:"],
                        correct: 1
                    },
                    {
                        question: "What does calc() do?",
                        options: ["Adds classes", "Performs calculations", "Counts elements", "Validates CSS"],
                        correct: 1
                    },
                    {
                        question: "What are pseudo-elements?",
                        options: ["Fake elements", "Style parts of elements", "Hidden elements", "Temporary elements"],
                        correct: 1
                    }
                ]
            },
            "OOP in Java": {
                intro: "Master Object-Oriented Programming in Java!",
                lessons: [
                    "OOP organizes code into objects that contain data and methods.",
                    "Classes and objects:\n\nclass Dog {\n  String name;\n  int age;\n  \n  void bark() {\n    System.out.println('Woof!');\n  }\n}\n\nDog myDog = new Dog();",
                    "Constructors initialize objects:\n\nclass Dog {\n  String name;\n  \n  Dog(String name) {\n    this.name = name;\n  }\n}",
                    "Encapsulation with getters/setters:\n\nprivate int age;\n\npublic int getAge() { return age; }\npublic void setAge(int age) { this.age = age; }",
                    "Inheritance:\n\nclass Animal {\n  void eat() { }\n}\n\nclass Dog extends Animal {\n  void bark() { }\n}",
                    "Polymorphism:\n\nAnimal myDog = new Dog();\nmyDog.eat();  // Works!\n\nDog specificDog = (Dog) myDog;\nspecificDog.bark();",
                    "Perfect! You understand Java OOP!"
                ],
                quiz: [
                    {
                        question: "What creates an object?",
                        options: ["create", "new", "make", "object"],
                        correct: 1
                    },
                    {
                        question: "What is encapsulation?",
                        options: ["Hiding implementation", "Creating classes", "Inheritance", "Interfaces"],
                        correct: 0
                    },
                    {
                        question: "Which keyword is used for inheritance?",
                        options: ["inherits", "extends", "implements", "derives"],
                        correct: 1
                    }
                ]
            },
            "Collections": {
                intro: "Master Java Collections - Lists, Sets, and Maps!",
                lessons: [
                    "Collections store and organize groups of objects.",
                    "ArrayList (dynamic array):\n\nimport java.util.ArrayList;\n\nArrayList<String> names = new ArrayList<>();\nnames.add('Alice');\nnames.get(0);  // Alice",
                    "LinkedList (efficient insertions):\n\nLinkedList<Integer> numbers = new LinkedList<>();\nnumbers.addFirst(1);\nnumbers.addLast(3);",
                    "HashSet (unique elements):\n\nHashSet<String> set = new HashSet<>();\nset.add('apple');\nset.add('apple');  // Ignored\nset.size();  // 1",
                    "HashMap (key-value pairs):\n\nHashMap<String, Integer> ages = new HashMap<>();\nages.put('Alice', 25);\nages.get('Alice');  // 25",
                    "Iterating collections:\n\nfor (String name : names) {\n  System.out.println(name);\n}",
                    "Excellent! You've mastered Java Collections!"
                ],
                quiz: [
                    {
                        question: "Which allows duplicates?",
                        options: ["HashSet", "ArrayList", "TreeSet", "None"],
                        correct: 1
                    },
                    {
                        question: "What does HashMap store?",
                        options: ["Only keys", "Only values", "Key-value pairs", "Indexes"],
                        correct: 2
                    },
                    {
                        question: "Which is fastest for middle insertions?",
                        options: ["ArrayList", "LinkedList", "HashSet", "Same speed"],
                        correct: 1
                    }
                ]
            },
            "Exception Handling": {
                intro: "Learn to handle errors gracefully in Java!",
                lessons: [
                    "Exceptions are errors that occur during program execution.",
                    "Try-catch blocks:\n\ntry {\n  int result = 10 / 0;  // Error!\n} catch (ArithmeticException e) {\n  System.out.println('Cannot divide by zero');\n}",
                    "Multiple catch blocks:\n\ntry {\n  // code\n} catch (NullPointerException e) {\n  // handle null\n} catch (ArrayIndexOutOfBoundsException e) {\n  // handle array\n}",
                    "Finally block always executes:\n\ntry {\n  // code\n} catch (Exception e) {\n  // handle\n} finally {\n  // cleanup (always runs)\n}",
                    "Throwing exceptions:\n\nvoid divide(int a, int b) throws ArithmeticException {\n  if (b == 0) throw new ArithmeticException();\n  return a / b;\n}",
                    "Custom exceptions:\n\nclass MyException extends Exception {\n  MyException(String msg) {\n    super(msg);\n  }\n}",
                    "Great! You can now handle errors properly!"
                ],
                quiz: [
                    {
                        question: "What keyword catches exceptions?",
                        options: ["catch", "handle", "except", "trap"],
                        correct: 0
                    },
                    {
                        question: "When does finally block execute?",
                        options: ["Never", "On error only", "Always", "On success only"],
                        correct: 2
                    },
                    {
                        question: "How do you throw an exception?",
                        options: ["throw new Exception()", "raise Exception()", "error Exception()", "exception()"],
                        correct: 0
                    }
                ]
            },
            "File I/O": {
                intro: "Learn to read and write files in Java!",
                lessons: [
                    "File I/O lets you save and load data to/from files.",
                    "Writing to files:\n\nimport java.io.FileWriter;\n\nFileWriter writer = new FileWriter('file.txt');\nwriter.write('Hello, World!');\nwriter.close();",
                    "Reading files:\n\nimport java.io.FileReader;\nimport java.io.BufferedReader;\n\nBufferedReader reader = new BufferedReader(new FileReader('file.txt'));\nString line = reader.readLine();\nreader.close();",
                    "Try-with-resources (auto-close):\n\ntry (FileWriter writer = new FileWriter('file.txt')) {\n  writer.write('Data');\n}  // Automatically closes",
                    "Reading line by line:\n\ntry (BufferedReader br = new BufferedReader(new FileReader('file.txt'))) {\n  String line;\n  while ((line = br.readLine()) != null) {\n    System.out.println(line);\n  }\n}",
                    "File operations:\n\nimport java.io.File;\n\nFile file = new File('file.txt');\nfile.exists();  // true/false\nfile.delete();  // Delete file",
                    "Perfect! You can now work with files in Java!"
                ],
                quiz: [
                    {
                        question: "Which class writes text to files?",
                        options: ["FileWriter", "Writer", "TextWriter", "OutputFile"],
                        correct: 0
                    },
                    {
                        question: "What does try-with-resources do?",
                        options: ["Allocates memory", "Auto-closes resources", "Catches errors", "Optimizes code"],
                        correct: 1
                    },
                    {
                        question: "Which reads files line by line efficiently?",
                        options: ["FileReader", "BufferedReader", "Scanner", "LineReader"],
                        correct: 1
                    }
                ]
            },
            "Multithreading": {
                intro: "Master concurrent programming with Java threads!",
                lessons: [
                    "Multithreading runs multiple tasks simultaneously.",
                    "Creating threads:\n\nclass MyThread extends Thread {\n  public void run() {\n    System.out.println('Thread running');\n  }\n}\n\nMyThread t = new MyThread();\nt.start();",
                    "Using Runnable interface:\n\nRunnable task = () -> {\n  System.out.println('Task running');\n};\n\nThread thread = new Thread(task);\nthread.start();",
                    "Thread synchronization:\n\nsynchronized void increment() {\n  count++;\n}",
                    "Wait and notify:\n\nsynchronized void produce() {\n  // produce item\n  notify();\n}\n\nsynchronized void consume() {\n  wait();\n  // consume item\n}",
                    "Thread pools:\n\nimport java.util.concurrent.ExecutorService;\nimport java.util.concurrent.Executors;\n\nExecutorService executor = Executors.newFixedThreadPool(5);\nexecutor.execute(task);",
                    "Amazing! You've mastered Java multithreading!"
                ],
                quiz: [
                    {
                        question: "How do you start a thread?",
                        options: ["run()", "start()", "begin()", "execute()"],
                        correct: 1
                    },
                    {
                        question: "What does synchronized prevent?",
                        options: ["Errors", "Race conditions", "Memory leaks", "Slow code"],
                        correct: 1
                    },
                    {
                        question: "What is a thread pool?",
                        options: ["Memory area", "Reusable threads", "Data structure", "Synchronization tool"],
                        correct: 1
                    }
                ]
            }
        };
