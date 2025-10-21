const lessonContent = {
    python: {
        course1: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
            learn: [
                { bot: 'Welcome to Python! 🐍 Let\'s start with the absolute basics - <span class="keyword-highlight">variables</span>!' },
                { bot: 'A variable is like a labeled box that stores data:<br><div class="code-example"><code>name = "Alice"<br>age = 25<br>is_student = True</code></div>' },
                { bot: 'Python has several <span class="keyword-highlight">data types</span>:<br>- <strong>String</strong>: Text in quotes ("hello")<br>- <strong>Integer</strong>: Whole numbers (42)<br>- <strong>Float</strong>: Decimals (3.14)<br>- <strong>Boolean</strong>: True or False' },
                { bot: 'Variable names should be descriptive:<br><div class="code-example"><code>user_name = "Bob"    # Good ✓<br>x = "Bob"            # Bad ✗</code></div>' },

                // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

                { bot: 'You can check a variable\'s type:<br><div class="code-example"><code>age = 25<br>print(type(age))  # <class \'int\'></code></div>' },
                { bot: 'Variables can change their value:<br><div class="code-example"><code>score = 10<br>score = 20  # Now score is 20</code></div>' },
                { bot: 'Python is case-sensitive! <code>Name</code> and <code>name</code> are different variables.' },
                { bot: '✅ Great! Variables are the foundation of all programming!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create a variable called name', code: '___BLANK___ = "John"', answer: 'name' },
                { type: 'mcq', question: 'Which is a valid variable name?', options: ['2name', 'user_age', 'user-age', 'user name'], correct: 1 },
                { type: 'fill', question: 'Store the number 42', code: 'answer = ___BLANK___', answer: '42' },
                { type: 'mcq', question: 'What type is "Hello"?', options: ['int', 'string', 'float', 'bool'], correct: 1 },
                { type: 'fill', question: 'Check variable type', code: 'print(___BLANK___(age))', answer: 'type' }
            ]
        },
        course2: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
            learn: [
                { bot: 'Now let\'s learn to display output with <span class="keyword-highlight">print()</span>! 📺' },
                { bot: 'The print function shows text and numbers on the screen:<br><div class="code-example"><code>print("Hello, World!")<br>print(42)</code></div>' },
                { bot: 'Print variables by using their names:<br><div class="code-example"><code>name = "Alice"<br>print(name)  # Outputs: Alice</code></div>' },
                { bot: 'Print multiple things separated by commas:<br><div class="code-example"><code>print("Python", "is", "awesome!")<br># Output: Python is awesome!</code></div>' },

                // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

                { bot: 'Change the separator with <span class="keyword-highlight">sep</span>:<br><div class="code-example"><code>print("apple", "orange", sep=", ")<br># Output: apple, orange</code></div>' },
                { bot: 'Remove the newline with <span class="keyword-highlight">end</span>:<br><div class="code-example"><code>print("Loading", end="...")<br>print("Done!")<br># Output: Loading...Done!</code></div>' },
                { bot: 'Print combines text and variables:<br><div class="code-example"><code>age = 25<br>print("I am", age, "years old")</code></div>' },
                { bot: '✅ Perfect! You can now display anything!' }
            ],
            exercises: [
                { type: 'fill', question: 'Display "Hello"', code: '___BLANK___("Hello")', answer: 'print' },
                { type: 'mcq', question: 'What does print(5 + 3) show?', options: ['5 + 3', '8', 'Error', '53'], correct: 1 },
                { type: 'fill', question: 'Print without newline', code: 'print("Hi", ___BLANK___="")', answer: 'end' },
                { type: 'mcq', question: 'Default separator in print?', options: ['Comma', 'Space', 'Newline', 'None'], correct: 1 },
                { type: 'fill', question: 'Change separator', code: 'print("a", "b", ___BLANK___="-")', answer: 'sep' }
            ]
        },
        course3: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
            learn: [
                { bot: 'Strings are text in Python! 📝 Let\'s master them.' },
                { bot: 'Create strings with quotes (single or double):<br><div class="code-example"><code>name = "Alice"<br>city = \'Paris\'</code></div>' },
                { bot: 'Strings have powerful <span class="keyword-highlight">methods</span>:<br><div class="code-example"><code>text = "python"<br>print(text.upper())  # PYTHON<br>print(text.lower())  # python</code></div>' },
                { bot: 'Replace text with <span class="keyword-highlight">.replace()</span>:<br><div class="code-example"><code>msg = "I like cats"<br>print(msg.replace("cats", "dogs"))</code></div>' },
                { bot: 'Check string contents:<br><div class="code-example"><code>filename = "report.pdf"<br>print(filename.endswith(".pdf"))  # True<br>print(filename.startswith("rep"))  # True</code></div>' },

                // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

                { bot: 'Count occurrences:<br><div class="code-example"><code>text = "banana"<br>print(text.count("a"))  # 3</code></div>' },
                { bot: 'Get string length:<br><div class="code-example"><code>word = "hello"<br>print(len(word))  # 5</code></div>' },
                { bot: 'Strings are indexed starting from 0:<br><div class="code-example"><code>word = "Python"<br>print(word[0])  # P<br>print(word[3])  # h</code></div>' },
                { bot: '✅ Strings are everywhere in programming!' }
            ],
            exercises: [
                { type: 'fill', question: 'Convert to uppercase', code: 'word = "hi"<br>print(word.___BLANK___())', answer: 'upper' },
                { type: 'mcq', question: 'What is "Hi".lower()?', options: ['HI', 'Hi', 'hi', 'Error'], correct: 2 },
                { type: 'fill', question: 'Replace text', code: 'text.___BLANK___("old", "new")', answer: 'replace' },
                { type: 'mcq', question: 'Check if starts with?', options: ['.begins()', '.startswith()', '.starts()', '.check()'], correct: 1 },
                { type: 'fill', question: 'Get string length', code: 'print(___BLANK___(word))', answer: 'len' }
            ]
        },
        course4: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
            learn: [
                { bot: 'Time for Math! ➗ Python is a powerful calculator.' },
                { bot: 'Basic arithmetic operators:<br><div class="code-example"><code>print(10 + 5)   # 15 Addition<br>print(10 - 5)   # 5 Subtraction<br>print(10 * 5)   # 50 Multiplication<br>print(10 / 5)   # 2.0 Division</code></div>' },
                { bot: 'Division always gives a decimal (float)!' },
                { bot: 'The <span class="keyword-highlight">power operator **</span>:<br><div class="code-example"><code>print(2 ** 3)   # 8 (2×2×2)<br>print(10 ** 2)  # 100 (10×10)</code></div>' },

                // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

                { bot: '<span class="keyword-highlight">Floor division //</span> gives only the whole part:<br><div class="code-example"><code>print(17 // 5)  # 3<br>print(20 // 6)  # 3</code></div>' },
                { bot: '<span class="keyword-highlight">Modulo %</span> gives the remainder:<br><div class="code-example"><code>print(17 % 5)   # 2<br>print(20 % 6)   # 2</code></div>' },
                { bot: 'Python follows PEMDAS order:<br><div class="code-example"><code>result = (5 + 3) * 2<br>print(result)  # 16, not 11</code></div>' },
                { bot: 'Variables work in math:<br><div class="code-example"><code>x = 10<br>y = 3<br>print(x + y)  # 13</code></div>' },
                { bot: '✅ Math is essential for programming!' }
            ],
            exercises: [
                { type: 'fill', question: 'Get remainder', code: 'print(17 ___BLANK___ 5)', answer: '%' },
                { type: 'mcq', question: 'What is 2 ** 3?', options: ['6', '8', '9', '5'], correct: 1 },
                { type: 'fill', question: 'Whole number division', code: 'print(17 ___BLANK___ 5)', answer: '//' },
                { type: 'mcq', question: 'What is (5 + 3) * 2?', options: ['11', '13', '16', '10'], correct: 2 },
                { type: 'fill', question: 'Square a number', code: 'print(5 ___BLANK___ 2)', answer: '**' }
            ]
        },
        course5: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
            learn: [
                { bot: 'Concatenation means joining strings! 🔗' },
                { bot: 'Use the <span class="keyword-highlight">+ operator</span>:<br><div class="code-example"><code>first = "Hello"<br>last = "World"<br>print(first + " " + last)  # Hello World</code></div>' },
                { bot: 'Remember to add spaces manually!' },
                { bot: '<span class="keyword-highlight">F-strings</span> are the modern way:<br><div class="code-example"><code>name = "Alice"<br>age = 25<br>print(f"I am {name}, age {age}")</code></div>' },

                // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

                { bot: 'F-strings can do math:<br><div class="code-example"><code>price = 100<br>print(f"Total: ${price * 1.1}")<br># Output: Total: $110.0</code></div>' },
                { bot: 'Repeat strings with <span class="keyword-highlight">*</span>:<br><div class="code-example"><code>print("Ha" * 3)   # HaHaHa<br>print("=" * 10)   # ==========</code></div>' },
                { bot: 'Great for separators and patterns!' },
                { bot: 'The <span class="keyword-highlight">.format()</span> method:<br><div class="code-example"><code>text = "Hello {}".format("World")<br>print(text)  # Hello World</code></div>' },
                { bot: '✅ Combining strings is super useful!' }
            ],
            exercises: [
                { type: 'fill', question: 'Join strings', code: 'result = "Hi" ___BLANK___ " there"', answer: '+' },
                { type: 'mcq', question: 'What does "A" * 4 give?', options: ['A4', 'AAAA', 'A*4', 'Error'], correct: 1 },
                { type: 'fill', question: 'Create f-string', code: 'name = "Bob"<br>print(___BLANK___"Hi {name}")', answer: 'f' },
                { type: 'mcq', question: 'What does "=" * 5 give?', options: ['=5', '5', '=====', 'Error'], correct: 2 },
                { type: 'fill', question: 'Use format method', code: 'text = "Hi {}".___BLANK___("there")', answer: 'format' }
            ]
        },
        course6: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
            learn: [
                { bot: 'Loops repeat code! 🔄 Save time and effort.' },
                { bot: 'The <span class="keyword-highlight">for loop</span>:<br><div class="code-example"><code>for i in range(5):<br>    print(i)<br># Prints: 0, 1, 2, 3, 4</code></div>' },
                { bot: 'range(5) goes from 0 to 4 (zero-indexing)!' },
                { bot: 'Specify start and end:<br><div class="code-example"><code>for i in range(2, 6):<br>    print(i)<br># Prints: 2, 3, 4, 5</code></div>' },

                // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

                { bot: 'The <span class="keyword-highlight">while loop</span>:<br><div class="code-example"><code>count = 0<br>while count < 3:<br>    print(count)<br>    count += 1</code></div>' },
                { bot: 'Be careful! While loops can run forever if the condition never becomes False.' },
                { bot: 'Loop through lists:<br><div class="code-example"><code>fruits = ["apple", "banana"]<br>for fruit in fruits:<br>    print(fruit)</code></div>' },
                { bot: 'Use <span class="keyword-highlight">break</span> to exit early:<br><div class="code-example"><code>for i in range(10):<br>    if i == 5:<br>        break<br>    print(i)  # Prints 0-4</code></div>' },
                { bot: '✅ Loops are powerful automation!' }
            ],
            exercises: [
                { type: 'fill', question: 'Start a for loop', code: '___BLANK___ i in range(3):<br>    print(i)', answer: 'for' },
                { type: 'mcq', question: 'How many times does range(5) loop?', options: ['4', '5', '6', 'Infinite'], correct: 1 },
                { type: 'fill', question: 'Start a while loop', code: '___BLANK___ x < 10:<br>    print(x)', answer: 'while' },
                { type: 'mcq', question: 'What does range(2, 5) produce?', options: ['2,3,4', '2,3,4,5', '0,1,2,3,4', '3,4,5'], correct: 0 },
                { type: 'fill', question: 'Exit loop early', code: 'if done:<br>    ___BLANK___', answer: 'break' }
            ]
        },
        course7: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
            learn: [
                { bot: 'Lists store multiple items! 📋 Perfect for collections.' },
                { bot: 'Create lists with square brackets:<br><div class="code-example"><code>fruits = ["apple", "banana", "orange"]<br>numbers = [1, 2, 3, 4, 5]</code></div>' },
                { bot: 'Access items by <span class="keyword-highlight">index</span> (starts at 0):<br><div class="code-example"><code>fruits = ["apple", "banana"]<br>print(fruits[0])  # apple<br>print(fruits[1])  # banana</code></div>' },
                { bot: 'Add items with <span class="keyword-highlight">.append()</span>:<br><div class="code-example"><code>fruits.append("grape")<br>print(fruits)  # ["apple", "banana", "grape"]</code></div>' },

                // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

                { bot: 'Remove items with <span class="keyword-highlight">.remove()</span>:<br><div class="code-example"><code>fruits.remove("banana")<br>print(fruits)  # ["apple", "grape"]</code></div>' },
                { bot: 'Get list length:<br><div class="code-example"><code>print(len(fruits))  # 2</code></div>' },
                { bot: 'Check if item exists with <span class="keyword-highlight">in</span>:<br><div class="code-example"><code>if "apple" in fruits:<br>    print("Found it!")</code></div>' },
                { bot: '✅ Lists are everywhere in Python!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create a list', code: 'nums = ___BLANK___1, 2, 3]', answer: '[' },
                { type: 'mcq', question: 'First item index?', options: ['1', '0', '-1', 'first'], correct: 1 },
                { type: 'fill', question: 'Add to list', code: 'fruits.___BLANK___("grape")', answer: 'append' },
                { type: 'mcq', question: 'Get list length?', options: ['size()', 'length()', 'len()', 'count()'], correct: 2 },
                { type: 'fill', question: 'Check if exists', code: 'if "apple" ___BLANK___ fruits:', answer: 'in' }
            ]
        },
        course8: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
    learn: [
        { bot: 'Dictionaries store key-value pairs! 📚 Like a real dictionary.' },
        { bot: 'Create with curly braces:<br><div class="code-example"><code>person = {<br>  "name": "Alice",<br>  "age": 25,<br>  "city": "NYC"<br>}</code></div>' },
        { bot: 'Access values by key:<br><div class="code-example"><code>print(person["name"])  # Alice<br>print(person["age"])   # 25</code></div>' },
        { bot: 'Add or modify items:<br><div class="code-example"><code>person["email"] = "alice@email.com"<br>person["age"] = 26  # Update</code></div>' },

        // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

        { bot: '<span class="keyword-highlight">.get()</span> is safer:<br><div class="code-example"><code>print(person.get("phone", "N/A"))<br># Returns "N/A" if key doesn\'t exist</code></div>' },
        { bot: 'Loop through dictionaries:<br><div class="code-example"><code>for key, value in person.items():<br>    print(f"{key}: {value}")</code></div>' },
        { bot: 'Useful methods:<br><div class="code-example"><code>person.keys()    # All keys<br>person.values()  # All values<br>person.items()   # Key-value pairs<br>"name" in person # Check if key exists</code></div>' },
        { bot: '✅ Dictionaries organize data perfectly!' }
    ],
    exercises: [
        { type: 'fill', question: 'Create dictionary', code: 'user = ___BLANK___"name": "Bob"}', answer: '{' },
        { type: 'mcq', question: 'Access dictionary value?', options: ['dict[key]', 'dict.key', 'dict->key', 'dict(key)'], correct: 0 },
        { type: 'fill', question: 'Safe access with default', code: 'val = person.___BLANK___("age", 0)', answer: 'get' },
        { type: 'mcq', question: 'Get all dictionary keys?', options: ['.keys()', '.getKeys()', '.allKeys()', '.keyList()'], correct: 0 },
        { type: 'fill', question: 'Check if key exists', code: 'if "name" ___BLANK___ person:', answer: 'in' }
    ]
},
course9: {
    videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
    learn: [
        { bot: 'Functions are reusable code blocks! ⚙️ Write once, use many times.' },
        { bot: 'Define with <span class="keyword-highlight">def</span>:<br><div class="code-example"><code>def greet():<br>    print("Hello!")<br><br>greet()  # Call it</code></div>' },
        { bot: 'Functions can take <span class="keyword-highlight">parameters</span>:<br><div class="code-example"><code>def greet(name):<br>    print(f"Hello, {name}!")<br><br>greet("Alice")</code></div>' },
        { bot: 'Return values with <span class="keyword-highlight">return</span>:<br><div class="code-example"><code>def add(a, b):<br>    return a + b<br><br>result = add(5, 3)  # 8</code></div>' },

        // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },

        { bot: 'Default parameters:<br><div class="code-example"><code>def greet(name="Guest"):<br>    print(f"Hello, {name}!")<br><br>greet()         # Hello, Guest!<br>greet("Bob")    # Hello, Bob!</code></div>' },
        { bot: 'Multiple return values:<br><div class="code-example"><code>def get_user():<br>    return "Alice", 25<br><br>name, age = get_user()</code></div>' },
        { bot: '<span class="keyword-highlight">Docstrings</span> document functions:<br><div class="code-example"><code>def add(a, b):<br>    """Add two numbers together"""<br>    return a + b</code></div>' },
        { bot: '✅ Functions keep code organized!' }
    ],
    exercises: [
        { type: 'fill', question: 'Define function', code: '___BLANK___ calculate():<br>    return 5', answer: 'def' },
        { type: 'mcq', question: 'Return a value?', options: ['return', 'give', 'send', 'output'], correct: 0 },
        { type: 'fill', question: 'Call function', code: '___BLANK___()', answer: 'greet' },
        { type: 'mcq', question: 'Function with parameters?', options: ['def func():', 'def func(x):', 'def func[]:', 'def func<x>:'], correct: 1 },
        { type: 'fill', question: 'Default parameter', code: 'def greet(name___BLANK___"Guest"):', answer: '=' }
    ]
},
course10: {
    videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', // Add this line
    learn: [
        { bot: 'Conditionals control program flow! 🔀 Make decisions in code.' },
        { bot: 'The <span class="keyword-highlight">if</span> statement:<br><div class="code-example"><code>age = 18<br>if age >= 18:<br>    print("You can vote!")</code></div>' },
        { bot: '<span class="keyword-highlight">else</span> handles the alternative:<br><div class="code-example"><code>if age >= 18:<br>    print("Adult")<br>else:<br>    print("Minor")</code></div>' },
        { bot: '<span class="keyword-highlight">elif</span> for multiple conditions:<br><div class="code-example"><code>score = 85<br>if score >= 90:<br>    print("A")<br>elif score >= 80:<br>    print("B")<br>else:<br>    print("C")</code></div>' },

        // ADD THIS VIDEO MESSAGE (around the middle)
    { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
    
        { bot: 'Comparison operators:<br>- == (equal)<br>- != (not equal)<br>- > (greater)<br>- < (less)<br>- >= (greater or equal)<br>- <= (less or equal)' },
        { bot: 'Logical operators combine conditions:<br><div class="code-example"><code>age = 20<br>has_license = True<br>if age >= 18 and has_license:<br>    print("Can drive!")</code></div>' },
        { bot: 'Use <span class="keyword-highlight">or</span> for either condition:<br><div class="code-example"><code>if age < 5 or age > 65:<br>    print("Discount applies")</code></div>' },
        { bot: '✅ Conditionals make programs smart!' }
    ],
    exercises: [
        { type: 'fill', question: 'Start condition', code: '___BLANK___ x > 10:<br>    print("Big")', answer: 'if' },
        { type: 'mcq', question: 'Check if equal?', options: ['=', '==', '===', 'equals'], correct: 1 },
        { type: 'fill', question: 'Alternative path', code: 'if x > 5:<br>    print("Yes")<br>___BLANK___:<br>    print("No")', answer: 'else' },
        { type: 'mcq', question: 'Multiple conditions?', options: ['elif', 'elseif', 'else if', 'if else'], correct: 0 },
        { type: 'fill', question: 'Both conditions true', code: 'if age > 18 ___BLANK___ has_id:', answer: 'and' }
    ]
  }
},

    javascript: {
        course1: {
            videoUrl: 'https://www.youtube.com/watch?v=7xStNKTM3bE&t=1s',
            learn: [
                { bot: 'Welcome to JavaScript! ⚡ The language of the web!' },
                { bot: 'Let\'s start with <span class="keyword-highlight">variables</span> - containers for data.' },
                { bot: 'Use <span class="keyword-highlight">let</span> for changeable variables:<br><div class="code-example"><code>let age = 25;<br>age = 26;  // Now age is 26<br>console.log(age);</code></div>' },
                { bot: 'Use <span class="keyword-highlight">const</span> for values that never change:<br><div class="code-example"><code>const PI = 3.14159;<br>// PI = 3.15;  // Error!</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Avoid the old <span class="keyword-highlight">var</span> keyword - use let and const!' },
                { bot: 'JavaScript data types:<br>- <strong>String</strong>: "text"<br>- <strong>Number</strong>: 42, 3.14<br>- <strong>Boolean</strong>: true, false<br>- <strong>Undefined</strong>: not assigned<br>- <strong>Null</strong>: intentionally empty' },
                { bot: '<span class="keyword-highlight">console.log()</span> displays output:<br><div class="code-example"><code>let name = "Alex";<br>console.log("Hello, " + name);</code></div>' },
                { bot: 'Check variable type:<br><div class="code-example"><code>console.log(typeof 42);      // "number"<br>console.log(typeof "text");  // "string"</code></div>' }
            ],
            exercises: [
                { type: 'fill', question: 'Declare changeable variable', code: '___BLANK___ count = 10;', answer: 'let' },
                { type: 'mcq', question: 'Which creates a constant?', options: ['var', 'let', 'const', 'constant'], correct: 2 },
                { type: 'fill', question: 'Display output', code: '___BLANK___.log("Hi");', answer: 'console' },
                { type: 'mcq', question: 'What is typeof "hello"?', options: ['text', 'string', 'String', 'char'], correct: 1 },
                { type: 'fill', question: 'Declare constant', code: '___BLANK___ MAX = 100;', answer: 'const' }
            ]
        },
        course2: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Strings and template literals! 📝 Modern JavaScript text handling.' },
                { bot: 'Strings use quotes:<br><div class="code-example"><code>let name = "Alice";<br>let city = \'Paris\';<br>let msg = `Hello`;</code></div>' },
                { bot: '<span class="keyword-highlight">Template literals</span> use backticks:<br><div class="code-example"><code>let name = "Bob";<br>let age = 25;<br>console.log(`I am ${name}, age ${age}`);</code></div>' },
                { bot: 'Template literals can span multiple lines:<br><div class="code-example"><code>let poem = `Roses are red<br>Violets are blue`;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'String methods:<br><div class="code-example"><code>let text = "hello";<br>console.log(text.toUpperCase());  // HELLO<br>console.log(text.length);         // 5</code></div>' },
                { bot: 'Check string contents:<br><div class="code-example"><code>let email = "test@email.com";<br>console.log(email.includes("@"));  // true<br>console.log(email.startsWith("test"));  // true</code></div>' },
                { bot: 'Extract parts with <span class="keyword-highlight">.slice()</span>:<br><div class="code-example"><code>let text = "JavaScript";<br>console.log(text.slice(0, 4));  // "Java"</code></div>' },
                { bot: 'Replace text:<br><div class="code-example"><code>let msg = "Hi Bob";<br>console.log(msg.replace("Bob", "Alice"));</code></div>' },
                { bot: '✅ Strings are fundamental to all programs!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create template literal', code: 'let msg = ___BLANK___Hello ${name}`;', answer: '`' },
                { type: 'mcq', question: 'What makes text uppercase?', options: ['.upper()', '.toUpperCase()', '.uppercase()', '.UPPER()'], correct: 1 },
                { type: 'fill', question: 'Get string length', code: 'let size = text.___BLANK___;', answer: 'length' },
                { type: 'mcq', question: 'Check if string contains text?', options: ['.has()', '.contains()', '.includes()', '.find()'], correct: 2 },
                { type: 'fill', question: 'Replace text', code: 'text.___BLANK___("old", "new")', answer: 'replace' }
            ]
        },
        course3: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Functions are reusable code blocks! 🎯' },
                { bot: 'Define with <span class="keyword-highlight">function</span> keyword:<br><div class="code-example"><code>function greet(name) {<br>  return "Hello " + name;<br>}<br>console.log(greet("Alice"));</code></div>' },
                { bot: 'Functions take <span class="keyword-highlight">parameters</span>:<br><div class="code-example"><code>function add(a, b) {<br>  return a + b;<br>}<br>console.log(add(5, 3));  // 8</code></div>' },
                { bot: '<span class="keyword-highlight">Arrow functions</span> are shorter:<br><div class="code-example"><code>const multiply = (x, y) => x * y;<br>console.log(multiply(4, 5));  // 20</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'One parameter? Skip parentheses:<br><div class="code-example"><code>const square = x => x * x;<br>console.log(square(5));  // 25</code></div>' },
                { bot: '<span class="keyword-highlight">Scope</span> controls variable access:<br><div class="code-example"><code>function test() {<br>  let secret = "hidden";<br>  console.log(secret);  // Works<br>}<br>// console.log(secret);  // Error!</code></div>' },
                { bot: 'Global scope is accessible everywhere!' },
                { bot: 'No return? Function returns <span class="keyword-highlight">undefined</span>:<br><div class="code-example"><code>function sayHi() {<br>  console.log("Hi");<br>}<br>let result = sayHi();  // undefined</code></div>' },
                { bot: '✅ Functions organize your code!' }
            ],
            exercises: [
                { type: 'fill', question: 'Define a function', code: '___BLANK___ greet() {<br>  console.log("Hi");<br>}', answer: 'function' },
                { type: 'mcq', question: 'What does (x) => x * 2 do?', options: ['Divides by 2', 'Doubles x', 'Adds 2', 'Squares x'], correct: 1 },
                { type: 'fill', question: 'Return a value', code: 'function add(a, b) {<br>  ___BLANK___ a + b;<br>}', answer: 'return' },
                { type: 'mcq', question: 'What is scope?', options: ['Function size', 'Variable accessibility', 'Function speed', 'Function type'], correct: 1 },
                { type: 'fill', question: 'Arrow function', code: 'const double = x ___BLANK___ x * 2;', answer: '=>' }
            ]
        },
        course4: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'The <span class="keyword-highlight">DOM</span> lets JavaScript control web pages! 🌐' },
                { bot: 'DOM = Document Object Model - your HTML as JavaScript objects.' },
                { bot: 'Select by ID:<br><div class="code-example"><code>let title = document.getElementById("title");<br>console.log(title);</code></div>' },
                { bot: 'Select multiple elements:<br><div class="code-example"><code>let buttons = document.querySelectorAll(".btn");<br>// All elements with class "btn"</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">querySelector</span> gets first match:<br><div class="code-example"><code>let first = document.querySelector(".item");</code></div>' },
                { bot: 'Change element content:<br><div class="code-example"><code>let heading = document.getElementById("main");<br>heading.textContent = "New Text";<br>heading.innerHTML = "<strong>Bold</strong>";</code></div>' },
                { bot: 'Modify styles:<br><div class="code-example"><code>title.style.color = "blue";<br>title.style.fontSize = "30px";</code></div>' },
                { bot: 'Add/remove CSS classes:<br><div class="code-example"><code>element.classList.add("active");<br>element.classList.remove("hidden");<br>element.classList.toggle("selected");</code></div>' }
            ],
            exercises: [
                { type: 'fill', question: 'Select by ID', code: 'let el = document.___BLANK___("myDiv");', answer: 'getElementById' },
                { type: 'mcq', question: 'Change text content?', options: ['innerHTML', 'textContent', 'value', 'text'], correct: 1 },
                { type: 'fill', question: 'Select first match', code: 'let first = document.___BLANK___(".item");', answer: 'querySelector' },
                { type: 'mcq', question: 'Add CSS class?', options: ['.addClass()', '.classList.add()', '.class.add()', '.addStyle()'], correct: 1 },
                { type: 'fill', question: 'Change style', code: 'element.___BLANK___.color = "red";', answer: 'style' }
            ]
        },
        course5: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Arrays and objects organize data! 📚' },
                { bot: '<span class="keyword-highlight">Arrays</span> store ordered lists:<br><div class="code-example"><code>let fruits = ["apple", "banana", "orange"];<br>console.log(fruits[0]);  // "apple"</code></div>' },
                { bot: 'Zero-indexed - first item is at index 0!' },
                { bot: 'Array methods:<br><div class="code-example"><code>fruits.push("grape");     // Add to end<br>fruits.pop();            // Remove from end<br>fruits.length;           // Get size<br>fruits.includes("apple"); // Check exists</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">.map()</span> transforms each item:<br><div class="code-example"><code>let nums = [1, 2, 3, 4];<br>let doubled = nums.map(n => n * 2);<br>// [2, 4, 6, 8]</code></div>' },
                { bot: '<span class="keyword-highlight">Objects</span> store key-value pairs:<br><div class="code-example"><code>let person = {<br>  name: "Bob",<br>  age: 30,<br>  city: "NYC"<br>};<br>console.log(person.name);  // "Bob"</code></div>' },
                { bot: 'Two ways to access properties:<br><div class="code-example"><code>person.age        // Dot notation<br>person["age"]     // Bracket notation</code></div>' },
                { bot: 'Arrays and objects can be nested!' },
                { bot: '✅ Data structures are essential!' }
            ],
            exercises: [
                { type: 'fill', question: 'Access first item', code: 'let nums = [5, 10];<br>console.log(nums___BLANK___);', answer: '[0]' },
                { type: 'mcq', question: 'Add to array end?', options: ['add()', 'push()', 'append()', 'insert()'], correct: 1 },
                { type: 'fill', question: 'Add to array', code: 'fruits.___BLANK___("grape");', answer: 'push' },
                { type: 'mcq', question: 'Access object property?', options: ['object[key]', 'object.key', 'Both', 'object->key'], correct: 2 },
                { type: 'fill', question: 'Get array size', code: 'let size = arr.___BLANK___;', answer: 'length' }
            ]
        },
        course6: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Events make pages interactive! 🖱️' },
                { bot: '<span class="keyword-highlight">click</span> is the most common:<br><div class="code-example"><code>let btn = document.getElementById("myBtn");<br>btn.addEventListener("click", function() {<br>  alert("Clicked!");<br>});</code></div>' },
                { bot: 'Arrow functions are cleaner:<br><div class="code-example"><code>btn.addEventListener("click", () => {<br>  console.log("Clicked!");<br>});</code></div>' },
                { bot: '<span class="keyword-highlight">Event object</span> has useful info:<br><div class="code-example"><code>btn.addEventListener("click", (event) => {<br>  console.log(event.target);  // The clicked element<br>  console.log(event.type);    // "click"<br>});</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Handle input changes:<br><div class="code-example"><code>let input = document.getElementById("name");<br>input.addEventListener("input", (e) => {<br>  console.log(e.target.value);<br>});</code></div>' },
                { bot: 'Common events:<br>- <strong>click</strong>: Mouse click<br>- <strong>input</strong>: Input changes<br>- <strong>submit</strong>: Form submit<br>- <strong>keypress</strong>: Key pressed<br>- <strong>mouseover</strong>: Mouse enters' },
                { bot: 'Prevent default behavior:<br><div class="code-example"><code>form.addEventListener("submit", (e) => {<br>  e.preventDefault();  // Stop submission<br>  // Handle yourself<br>});</code></div>' },
                { bot: 'Remove event listeners:<br><div class="code-example"><code>function handler() { console.log("hi"); }<br>btn.addEventListener("click", handler);<br>btn.removeEventListener("click", handler);</code></div>' },
                { bot: '✅ Events bring websites to life!' }
            ],
            exercises: [
                { type: 'fill', question: 'Add click listener', code: 'btn.___BLANK___("click", fn);', answer: 'addEventListener' },
                { type: 'mcq', question: 'Event fires on typing?', options: ['click', 'input', 'change', 'type'], correct: 1 },
                { type: 'fill', question: 'Prevent default', code: 'event.___BLANK___();', answer: 'preventDefault' },
                { type: 'mcq', question: 'What is e.target?', options: ['Event type', 'Element that triggered event', 'Event time', 'Mouse position'], correct: 1 },
                { type: 'fill', question: 'Remove listener', code: 'btn.___BLANK___("click", fn);', answer: 'removeEventListener' }
            ]
        },
        course7: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Async code handles operations that take time! ⏳' },
                { bot: '<span class="keyword-highlight">Promises</span> represent future values:<br><div class="code-example"><code>const promise = new Promise((resolve, reject) => {<br>  setTimeout(() => resolve("Done!"), 1000);<br>});</code></div>' },
                { bot: 'Use <span class="keyword-highlight">.then()</span> for success:<br><div class="code-example"><code>promise.then(result => {<br>  console.log(result);  // "Done!" after 1 sec<br>});</code></div>' },
                { bot: 'Use <span class="keyword-highlight">.catch()</span> for errors:<br><div class="code-example"><code>promise<br>  .then(result => console.log(result))<br>  .catch(error => console.log(error));</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">async/await</span> looks synchronous:<br><div class="code-example"><code>async function getData() {<br>  const result = await promise;<br>  console.log(result);<br>}</code></div>' },
                { bot: 'Always use <span class="keyword-highlight">try/catch</span> with await:<br><div class="code-example"><code>async function getData() {<br>  try {<br>    const result = await promise;<br>    console.log(result);<br>  } catch (error) {<br>    console.log(error);<br>  }<br>}</code></div>' },
                { bot: 'Fetch data from APIs:<br><div class="code-example"><code>async function getUser() {<br>  const response = await fetch("api.com/user");<br>  const data = await response.json();<br>  return data;<br>}</code></div>' },
                { bot: '✅ Async unlocks powerful features!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create async function', code: '___BLANK___ function getData() {}', answer: 'async' },
                { type: 'mcq', question: 'Wait for promise?', options: ['wait', 'await', 'promise', 'then'], correct: 1 },
                { type: 'fill', question: 'Handle success', code: 'promise.___BLANK___(result => {})', answer: 'then' },
                { type: 'mcq', question: 'Catch async errors?', options: ['error', 'catch', 'fail', 'exception'], correct: 1 },
                { type: 'fill', question: 'Fetch from API', code: 'const res = await ___BLANK___("url")', answer: 'fetch' }
            ]
        },
        course8: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'ES6 brought modern JavaScript features! ✨ Let\'s explore them.' },
                { bot: '<span class="keyword-highlight">Destructuring</span> extracts values:<br><div class="code-example"><code>const person = { name: "Alice", age: 25 };<br>const { name, age } = person;<br>console.log(name);  // Alice</code></div>' },
                { bot: 'Array destructuring:<br><div class="code-example"><code>const colors = ["red", "green", "blue"];<br>const [first, second] = colors;<br>console.log(first);  // red</code></div>' },
                { bot: '<span class="keyword-highlight">Spread operator ...</span> expands arrays:<br><div class="code-example"><code>const arr1 = [1, 2, 3];<br>const arr2 = [4, 5, 6];<br>const combined = [...arr1, ...arr2];<br>// [1, 2, 3, 4, 5, 6]</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Spread with objects:<br><div class="code-example"><code>const user = { name: "Bob" };<br>const fullUser = { ...user, age: 30 };<br>// { name: "Bob", age: 30 }</code></div>' },
                { bot: '<span class="keyword-highlight">Default parameters</span>:<br><div class="code-example"><code>function greet(name = "Guest") {<br>  console.log(`Hello ${name}`);<br>}<br>greet();  // Hello Guest</code></div>' },
                { bot: '<span class="keyword-highlight">Rest parameters ...</span> collect arguments:<br><div class="code-example"><code>function sum(...numbers) {<br>  return numbers.reduce((a, b) => a + b);<br>}<br>sum(1, 2, 3, 4);  // 10</code></div>' },
                { bot: '✅ ES6 makes code cleaner!' }
            ],
            exercises: [
                { type: 'fill', question: 'Destructure object', code: 'const ___BLANK___ name } = person;', answer: '{' },
                { type: 'mcq', question: 'Spread operator?', options: ['...', '***', '..', '::'], correct: 0 },
                { type: 'fill', question: 'Default parameter', code: 'function greet(name ___BLANK___ "Guest") {}', answer: '=' },
                { type: 'mcq', question: 'Collect remaining arguments?', options: ['...args', 'args[]', '*args', 'args...'], correct: 0 },
                { type: 'fill', question: 'Array destructuring', code: 'const ___BLANK___a, b] = [1, 2];', answer: '[' }
            ]
        },
        course9: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Error handling prevents crashes! 🐛 Handle problems gracefully.' },
                { bot: '<span class="keyword-highlight">try/catch</span> catches errors:<br><div class="code-example"><code>try {<br>  const data = JSON.parse(invalidJSON);<br>} catch (error) {<br>  console.log("Error:", error.message);<br>}</code></div>' },
                { bot: 'Without try/catch, errors crash your program!' },
                { bot: '<span class="keyword-highlight">finally</span> always runs:<br><div class="code-example"><code>try {<br>  riskyOperation();<br>} catch (error) {<br>  console.log("Failed");<br>} finally {<br>  console.log("Cleanup");<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Throw custom errors:<br><div class="code-example"><code>function divide(a, b) {<br>  if (b === 0) {<br>    throw new Error("Cannot divide by zero");<br>  }<br>  return a / b;<br>}</code></div>' },
                { bot: 'Error object properties:<br><div class="code-example"><code>catch (error) {<br>  console.log(error.name);     // Error type<br>  console.log(error.message);  // Description<br>  console.log(error.stack);    // Stack trace<br>}</code></div>' },
                { bot: 'Handle async errors:<br><div class="code-example"><code>async function getData() {<br>  try {<br>    const res = await fetch(url);<br>    const data = await res.json();<br>  } catch (error) {<br>    console.log("Fetch failed:", error);<br>  }<br>}</code></div>' },
                { bot: '✅ Good error handling = reliable code!' }
            ],
            exercises: [
                { type: 'fill', question: 'Start error handling', code: '___BLANK___ {<br>  riskyCode();<br>}', answer: 'try' },
                { type: 'mcq', question: 'Catch errors?', options: ['error', 'catch', 'handle', 'except'], correct: 1 },
                { type: 'fill', question: 'Always runs cleanup', code: '___BLANK___ {<br>  cleanup();<br>}', answer: 'finally' },
                { type: 'mcq', question: 'Throw custom error?', options: ['error new', 'throw new Error()', 'raise error', 'throw error()'], correct: 1 },
                { type: 'fill', question: 'Catch block parameter', code: 'catch (___BLANK___) {<br>  console.log(error);<br>}', answer: 'error' }
            ]
        },
        course10: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Modules organize code! 📦 Split into reusable files.' },
                { bot: '<span class="keyword-highlight">export</span> makes code available:<br><div class="code-example"><code>// math.js<br>export function add(a, b) {<br>  return a + b;<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">import</span> uses exported code:<br><div class="code-example"><code>// main.js<br>import { add } from "./math.js";<br>console.log(add(5, 3));</code></div>' },
                { bot: 'Default exports:<br><div class="code-example"><code>// utils.js<br>export default function greet() {<br>  return "Hello!";<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Import default exports:<br><div class="code-example"><code>import greet from "./utils.js";<br>console.log(greet());</code></div>' },
                { bot: 'Import everything with *:<br><div class="code-example"><code>import * as math from "./math.js";<br>math.add(1, 2);</code></div>' },
                { bot: 'Rename imports:<br><div class="code-example"><code>import { add as sum } from "./math.js";<br>console.log(sum(3, 4));</code></div>' },
                { bot: '✅ Modules keep code organized!' }
            ],
            exercises: [
                { type: 'fill', question: 'Make function available', code: '___BLANK___ function test() {}', answer: 'export' },
                { type: 'mcq', question: 'Use exported code?', options: ['require', 'import', 'include', 'use'], correct: 1 },
                { type: 'fill', question: 'Default export', code: 'export ___BLANK___ function main() {}', answer: 'default' },
                { type: 'mcq', question: 'Import all exports?', options: ['import all', 'import *', 'import everything', 'import {}'], correct: 1 },
                { type: 'fill', question: 'Import specific function', code: 'import ___BLANK___ add } from "./math.js"', answer: '{' }
            ]
        }
    },

    html: {
        course1: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'HTML builds web page structure! 🌐 Every website uses it.' },
                { bot: 'HTML uses <span class="keyword-highlight">tags</span> - usually in pairs (opening and closing).' },
                { bot: 'Basic HTML structure:<br><div class="code-example"><code>&lt;!DOCTYPE html&gt;<br>&lt;html&gt;<br>  &lt;head&gt;<br>    &lt;title&gt;My Page&lt;/title&gt;<br>  &lt;/head&gt;<br>  &lt;body&gt;<br>    &lt;h1&gt;Hello!&lt;/h1&gt;<br>  &lt;/body&gt;<br>&lt;/html&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;head&gt;</span> = metadata. <span class="keyword-highlight">&lt;body&gt;</span> = visible content.' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Headings from h1 (biggest) to h6 (smallest):<br><div class="code-example"><code>&lt;h1&gt;Main Title&lt;/h1&gt;<br>&lt;h2&gt;Section&lt;/h2&gt;<br>&lt;h3&gt;Subsection&lt;/h3&gt;</code></div>' },
                { bot: 'Use h1 for main title - only one per page!' },
                { bot: 'Paragraphs use <span class="keyword-highlight">&lt;p&gt;</span>:<br><div class="code-example"><code>&lt;p&gt;This is a paragraph.&lt;/p&gt;<br>&lt;p&gt;Another paragraph.&lt;/p&gt;</code></div>' },
                { bot: 'Line breaks with <span class="keyword-highlight">&lt;br&gt;</span> (self-closing):<br><div class="code-example"><code>&lt;p&gt;First line&lt;br&gt;Second line&lt;/p&gt;</code></div>' }
            ],
            exercises: [
                { type: 'fill', question: 'Create main heading', code: '___BLANK___Title&lt;/h1&gt;', answer: '<h1>' },
                { type: 'mcq', question: 'Largest heading?', options: ['h6', 'h3', 'h1', 'h0'], correct: 2 },
                { type: 'fill', question: 'Create paragraph', code: '___BLANK___Text&lt;/p&gt;', answer: '<p>' },
                { type: 'mcq', question: 'Visible content goes in?', options: ['<head>', '<body>', '<html>', '<content>'], correct: 1 },
                { type: 'fill', question: 'Add line break', code: 'Line 1___BLANK___Line 2', answer: '<br>' }
            ]
        },
        course2: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Text formatting makes content stand out! ✍️' },
                { bot: '<span class="keyword-highlight">&lt;strong&gt;</span> makes text bold (important):<br><div class="code-example"><code>&lt;strong&gt;Important text&lt;/strong&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;em&gt;</span> makes text italic (emphasized):<br><div class="code-example"><code>&lt;em&gt;Emphasized text&lt;/em&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;b&gt;</span> and <span class="keyword-highlight">&lt;i&gt;</span> also work:<br><div class="code-example"><code>&lt;b&gt;Bold&lt;/b&gt; and &lt;i&gt;Italic&lt;/i&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Use strong/em for meaning, b/i for style only!' },
                { bot: '<span class="keyword-highlight">&lt;mark&gt;</span> highlights text:<br><div class="code-example"><code>&lt;mark&gt;Highlighted&lt;/mark&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;small&gt;</span> makes text smaller:<br><div class="code-example"><code>&lt;small&gt;Fine print&lt;/small&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;del&gt;</span> shows deleted text:<br><div class="code-example"><code>&lt;del&gt;Deleted&lt;/del&gt; &lt;ins&gt;Inserted&lt;/ins&gt;</code></div>' },
                { bot: '✅ Formatting makes content readable!' }
            ],
            exercises: [
                { type: 'fill', question: 'Make text bold', code: '&lt;___BLANK___&gt;Bold&lt;/strong&gt;', answer: 'strong' },
                { type: 'mcq', question: 'Which emphasizes text?', options: ['<strong>', '<em>', '<b>', '<mark>'], correct: 1 },
                { type: 'fill', question: 'Highlight text', code: '&lt;___BLANK___&gt;Highlighted&lt;/mark&gt;', answer: 'mark' },
                { type: 'mcq', question: 'Show deleted text?', options: ['<delete>', '<del>', '<removed>', '<strike>'], correct: 1 },
                { type: 'fill', question: 'Make text italic', code: '&lt;___BLANK___&gt;Italic&lt;/i&gt;', answer: 'i' }
            ]
        },
        course3: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Lists organize information! 📝 Two types: ordered and unordered.' },
                { bot: '<span class="keyword-highlight">Unordered lists</span> use bullets:<br><div class="code-example"><code>&lt;ul&gt;<br>  &lt;li&gt;First item&lt;/li&gt;<br>  &lt;li&gt;Second item&lt;/li&gt;<br>&lt;/ul&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">Ordered lists</span> use numbers:<br><div class="code-example"><code>&lt;ol&gt;<br>  &lt;li&gt;Step one&lt;/li&gt;<br>  &lt;li&gt;Step two&lt;/li&gt;<br>&lt;/ol&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;li&gt;</span> creates list items - works in both!' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Nest lists inside lists:<br><div class="code-example"><code>&lt;ul&gt;<br>  &lt;li&gt;Fruits<br>    &lt;ul&gt;<br>      &lt;li&gt;Apple&lt;/li&gt;<br>      &lt;li&gt;Banana&lt;/li&gt;<br>    &lt;/ul&gt;<br>  &lt;/li&gt;<br>&lt;/ul&gt;</code></div>' },
                { bot: 'Description lists for terms:<br><div class="code-example"><code>&lt;dl&gt;<br>  &lt;dt&gt;HTML&lt;/dt&gt;<br>  &lt;dd&gt;HyperText Markup Language&lt;/dd&gt;<br>&lt;/dl&gt;</code></div>' },
                { bot: 'Lists are great for menus, ingredients, steps!' },
                { bot: '✅ Lists structure your content!' }
            ],
            exercises: [
                { type: 'fill', question: 'Start ordered list', code: '___BLANK___<br>  &lt;li&gt;First&lt;/li&gt;<br>&lt;/ol&gt;', answer: '<ol>' },
                { type: 'mcq', question: 'Create list items?', options: ['<item>', '<li>', '<list>', '<l>'], correct: 1 },
                { type: 'fill', question: 'Start unordered list', code: '___BLANK___<br>  &lt;li&gt;Item&lt;/li&gt;<br>&lt;/ul&gt;', answer: '<ul>' },
                { type: 'mcq', question: 'Which uses numbers?', options: ['<ul>', '<ol>', '<li>', '<dl>'], correct: 1 },
                { type: 'fill', question: 'Create list item', code: '___BLANK___Text&lt;/li&gt;', answer: '<li>' }
            ]
        },
        course4: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Add images and media! 🖼️ Visual content engages users.' },
                { bot: '<span class="keyword-highlight">&lt;img&gt;</span> inserts images (self-closing):<br><div class="code-example"><code>&lt;img src="photo.jpg" alt="A sunset"&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">src</span> = image location (path or URL).' },
                { bot: '<span class="keyword-highlight">alt</span> = text description:<br>- Shows if image fails<br>- Read by screen readers<br>- Helps SEO<br>Always include it!' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Control size:<br><div class="code-example"><code>&lt;img src="pic.jpg" alt="Photo" width="300" height="200"&gt;</code></div>' },
                { bot: 'Add videos:<br><div class="code-example"><code>&lt;video controls width="400"&gt;<br>  &lt;source src="movie.mp4" type="video/mp4"&gt;<br>  Browser doesn\'t support video.<br>&lt;/video&gt;</code></div>' },
                { bot: '<strong>controls</strong> attribute adds play/pause buttons!' },
                { bot: 'Audio works similarly:<br><div class="code-example"><code>&lt;audio controls&gt;<br>  &lt;source src="song.mp3" type="audio/mp3"&gt;<br>&lt;/audio&gt;</code></div>' },
                { bot: '✅ Media makes sites engaging!' }
            ],
            exercises: [
                { type: 'fill', question: 'Insert image', code: '&lt;___BLANK___ src="pic.jpg" alt="Photo"&gt;', answer: 'img' },
                { type: 'mcq', question: '"alt" provides?', options: ['Size', 'Link', 'Description', 'Style'], correct: 2 },
                { type: 'fill', question: 'Specify image location', code: '&lt;img ___BLANK___="photo.jpg" alt="Pic"&gt;', answer: 'src' },
                { type: 'mcq', question: 'Add video controls?', options: ['control', 'controls', 'buttons', 'player'], correct: 1 },
                { type: 'fill', question: 'Add video', code: '&lt;___BLANK___ controls&gt;<br>  &lt;source src="vid.mp4"&gt;<br>&lt;/video&gt;', answer: 'video' }
            ]
        },
        course5: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Forms collect user input! 📋 Essential for interaction.' },
                { bot: '<span class="keyword-highlight">&lt;form&gt;</span> wraps all inputs:<br><div class="code-example"><code>&lt;form&gt;<br>  &lt;input type="text" placeholder="Name"&gt;<br>  &lt;button&gt;Submit&lt;/button&gt;<br>&lt;/form&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;input&gt;</span> has many types:<br>- text: Single-line<br>- email: Email address<br>- password: Hidden<br>- number: Numeric<br>- date: Date picker<br>- checkbox: Yes/no<br>- radio: Select one' },
                { bot: 'Inputs with labels:<br><div class="code-example"><code>&lt;label for="name"&gt;Name:&lt;/label&gt;<br>&lt;input type="text" id="name" name="name"&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">&lt;textarea&gt;</span> for long text:<br><div class="code-example"><code>&lt;textarea rows="5" cols="30"&gt;<br>Default text<br>&lt;/textarea&gt;</code></div>' },
                { bot: 'Dropdown menus:<br><div class="code-example"><code>&lt;select name="country"&gt;<br>  &lt;option value="us"&gt;USA&lt;/option&gt;<br>  &lt;option value="uk"&gt;UK&lt;/option&gt;<br>&lt;/select&gt;</code></div>' },
                { bot: 'Checkboxes for multiple choices:<br><div class="code-example"><code>&lt;input type="checkbox" id="agree"&gt;<br>&lt;label for="agree"&gt;I agree&lt;/label&gt;</code></div>' },
                { bot: '<strong>placeholder</strong> = hint text. <strong>required</strong> = mandatory field.' },
                { bot: '✅ Forms enable user interaction!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create text input', code: '&lt;___BLANK___ type="text"&gt;', answer: 'input' },
                { type: 'mcq', question: 'Wrap form inputs?', options: ['<div>', '<form>', '<input>', '<fieldset>'], correct: 1 },
                { type: 'fill', question: 'Multi-line input', code: '&lt;___BLANK___ rows="5"&gt;&lt;/textarea&gt;', answer: 'textarea' },
                { type: 'mcq', question: 'Hide text input?', options: ['hidden', 'password', 'secret', 'private'], correct: 1 },
                { type: 'fill', question: 'Create dropdown', code: '&lt;___BLANK___ name="choice"&gt;<br>  &lt;option&gt;A&lt;/option&gt;<br>&lt;/select&gt;', answer: 'select' }
            ]
        },
        course6: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Links connect pages! 🔗 Fundamental to the web.' },
                { bot: '<span class="keyword-highlight">&lt;a&gt;</span> (anchor) creates links:<br><div class="code-example"><code>&lt;a href="https://google.com"&gt;Visit Google&lt;/a&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">href</span> = destination URL.' },
                { bot: 'Open in new tab:<br><div class="code-example"><code>&lt;a href="page.html" target="_blank"&gt;<br>  Open in New Tab<br>&lt;/a&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Link to page sections:<br><div class="code-example"><code>&lt;a href="#section1"&gt;Jump to Section 1&lt;/a&gt;<br><br>&lt;h2 id="section1"&gt;Section 1&lt;/h2&gt;</code></div>' },
                { bot: 'Email links use <span class="keyword-highlight">mailto:</span>:<br><div class="code-example"><code>&lt;a href="mailto:you@email.com"&gt;Email Me&lt;/a&gt;</code></div>' },
                { bot: 'Phone links use <span class="keyword-highlight">tel:</span>:<br><div class="code-example"><code>&lt;a href="tel:+1234567890"&gt;Call Us&lt;/a&gt;</code></div>' },
                { bot: 'Download links:<br><div class="code-example"><code>&lt;a href="file.pdf" download&gt;Download PDF&lt;/a&gt;</code></div>' },
                { bot: '✅ Links create the web!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create link', code: '&lt;___BLANK___ href="site.com"&gt;Click&lt;/a&gt;', answer: 'a' },
                { type: 'mcq', question: 'Attribute with URL?', options: ['link', 'url', 'href', 'src'], correct: 2 },
                { type: 'fill', question: 'Open in new tab', code: '&lt;a href="page.html" ___BLANK___="_blank"&gt;', answer: 'target' },
                { type: 'mcq', question: 'Link to email?', options: ['email:', 'mailto:', 'mail:', 'e:'], correct: 1 },
                { type: 'fill', question: 'Link to section', code: '&lt;a ___BLANK___="#top"&gt;Go to Top&lt;/a&gt;', answer: 'href' }
            ]
        },
        course7: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Tables display data in rows and columns! 📊' },
                { bot: 'Create with <span class="keyword-highlight">&lt;table&gt;</span>:<br><div class="code-example"><code>&lt;table&gt;<br>  &lt;tr&gt;<br>    &lt;td&gt;Cell 1&lt;/td&gt;<br>    &lt;td&gt;Cell 2&lt;/td&gt;<br>  &lt;/tr&gt;<br>&lt;/table&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;tr&gt;</span> = rows, <span class="keyword-highlight">&lt;td&gt;</span> = cells.' },
                { bot: 'Headers with <span class="keyword-highlight">&lt;th&gt;</span>:<br><div class="code-example"><code>&lt;table&gt;<br>  &lt;tr&gt;<br>    &lt;th&gt;Name&lt;/th&gt;<br>    &lt;th&gt;Age&lt;/th&gt;<br>  &lt;/tr&gt;<br>&lt;/table&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Organize with <span class="keyword-highlight">&lt;thead&gt;</span>, <span class="keyword-highlight">&lt;tbody&gt;</span>, <span class="keyword-highlight">&lt;tfoot&gt;</span>:<br><div class="code-example"><code>&lt;table&gt;<br>  &lt;thead&gt;<br>    &lt;tr&gt;&lt;th&gt;Product&lt;/th&gt;&lt;/tr&gt;<br>  &lt;/thead&gt;<br>  &lt;tbody&gt;<br>    &lt;tr&gt;&lt;td&gt;Apple&lt;/td&gt;&lt;/tr&gt;<br>  &lt;/tbody&gt;<br>&lt;/table&gt;</code></div>' },
                { bot: 'Merge cells with <span class="keyword-highlight">colspan</span> and <span class="keyword-highlight">rowspan</span>:<br><div class="code-example"><code>&lt;td colspan="2"&gt;Spans 2 columns&lt;/td&gt;<br>&lt;td rowspan="2"&gt;Spans 2 rows&lt;/td&gt;</code></div>' },
                { bot: 'Style tables with CSS!' },
                { bot: '✅ Tables organize data perfectly!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create table', code: '&lt;___BLANK___&gt;&lt;/table&gt;', answer: 'table' },
                { type: 'mcq', question: 'Create row?', options: ['<td>', '<tr>', '<th>', '<row>'], correct: 1 },
                { type: 'fill', question: 'Create cell', code: '&lt;___BLANK___&gt;Data&lt;/td&gt;', answer: 'td' },
                { type: 'mcq', question: 'Create header cell?', options: ['<th>', '<header>', '<td>', '<head>'], correct: 0 },
                { type: 'fill', question: 'Span columns', code: '&lt;td ___BLANK___="2"&gt;', answer: 'colspan' }
            ]
        },
        course8: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Semantic HTML gives meaning to content! 🏗️ Better than generic divs.' },
                { bot: '<span class="keyword-highlight">&lt;header&gt;</span> for top section:<br><div class="code-example"><code>&lt;header&gt;<br>  &lt;h1&gt;My Website&lt;/h1&gt;<br>  &lt;nav&gt;Navigation&lt;/nav&gt;<br>&lt;/header&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;nav&gt;</span> for navigation:<br><div class="code-example"><code>&lt;nav&gt;<br>  &lt;a href="/"&gt;Home&lt;/a&gt;<br>  &lt;a href="/about"&gt;About&lt;/a&gt;<br>&lt;/nav&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;main&gt;</span> for main content:<br><div class="code-example"><code>&lt;main&gt;<br>  &lt;article&gt;Main content here&lt;/article&gt;<br>&lt;/main&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">&lt;article&gt;</span> for independent content:<br><div class="code-example"><code>&lt;article&gt;<br>  &lt;h2&gt;Blog Post Title&lt;/h2&gt;<br>  &lt;p&gt;Content...&lt;/p&gt;<br>&lt;/article&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;section&gt;</span> groups related content:<br><div class="code-example"><code>&lt;section&gt;<br>  &lt;h2&gt;Services&lt;/h2&gt;<br>  &lt;p&gt;Our services...&lt;/p&gt;<br>&lt;/section&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">&lt;footer&gt;</span> for bottom section:<br><div class="code-example"><code>&lt;footer&gt;<br>  &lt;p&gt;&copy; 2024 Company&lt;/p&gt;<br>&lt;/footer&gt;</code></div>' },
                { bot: '✅ Semantic HTML improves accessibility and SEO!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create header', code: '&lt;___BLANK___&gt;<br>  &lt;h1&gt;Title&lt;/h1&gt;<br>&lt;/header&gt;', answer: 'header' },
                { type: 'mcq', question: 'Navigation element?', options: ['<navigation>', '<nav>', '<menu>', '<links>'], correct: 1 },
                { type: 'fill', question: 'Main content area', code: '&lt;___BLANK___&gt;Content&lt;/main&gt;', answer: 'main' },
                { type: 'mcq', question: 'Independent content?', options: ['<content>', '<article>', '<post>', '<item>'], correct: 1 },
                { type: 'fill', question: 'Page footer', code: '&lt;___BLANK___&gt;<br>  Copyright<br>&lt;/footer&gt;', answer: 'footer' }
            ]
        },
        course9: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Meta tags control how pages appear! 🔍 Essential for SEO.' },
                { bot: '<span class="keyword-highlight">Charset</span> sets character encoding:<br><div class="code-example"><code>&lt;meta charset="UTF-8"&gt;</code></div>' },
                { bot: 'Always include this in your <code>&lt;head&gt;</code>!' },
                { bot: '<span class="keyword-highlight">Viewport</span> for mobile:<br><div class="code-example"><code>&lt;meta name="viewport" <br>  content="width=device-width, initial-scale=1.0"&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">Description</span> for search engines:<br><div class="code-example"><code>&lt;meta name="description" <br>  content="Learn web development online"&gt;</code></div>' },
                { bot: 'Shows in search results - keep under 160 characters!' },
                { bot: '<span class="keyword-highlight">Keywords</span> (less important now):<br><div class="code-example"><code>&lt;meta name="keywords" <br>  content="html, css, javascript"&gt;</code></div>' },
                { bot: 'Open Graph for social media:<br><div class="code-example"><code>&lt;meta property="og:title" content="Page Title"&gt;<br>&lt;meta property="og:image" content="image.jpg"&gt;</code></div>' },
                { bot: '✅ Meta tags boost discoverability!' }
            ],
            exercises: [
                { type: 'fill', question: 'Set character encoding', code: '&lt;meta ___BLANK___="UTF-8"&gt;', answer: 'charset' },
                { type: 'mcq', question: 'Mobile-friendly meta?', options: ['mobile', 'viewport', 'responsive', 'device'], correct: 1 },
                { type: 'fill', question: 'Page description', code: '&lt;meta ___BLANK___="description" content="Text"&gt;', answer: 'name' },
                { type: 'mcq', question: 'Description character limit?', options: ['100', '160', '200', '300'], correct: 1 },
                { type: 'fill', question: 'Open Graph meta', code: '&lt;meta ___BLANK___="og:title" content="Title"&gt;', answer: 'property' }
            ]
        },
        course10: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Accessibility makes web for everyone! ♿ Important for all users.' },
                { bot: '<span class="keyword-highlight">alt</span> text describes images:<br><div class="code-example"><code>&lt;img src="cat.jpg" alt="Orange cat sleeping"&gt;</code></div>' },
                { bot: '<span class="keyword-highlight">aria-label</span> adds descriptions:<br><div class="code-example"><code>&lt;button aria-label="Close menu"&gt;×&lt;/button&gt;</code></div>' },
                { bot: 'Use semantic HTML for screen readers:<br><div class="code-example"><code>&lt;nav&gt;Navigation&lt;/nav&gt;<br>&lt;main&gt;Main content&lt;/main&gt;<br>&lt;footer&gt;Footer&lt;/footer&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">Labels</span> connect to inputs:<br><div class="code-example"><code>&lt;label for="email"&gt;Email:&lt;/label&gt;<br>&lt;input type="email" id="email"&gt;</code></div>' },
                { bot: 'Add <span class="keyword-highlight">tabindex</span> for keyboard:<br><div class="code-example"><code>&lt;div tabindex="0"&gt;Focusable&lt;/div&gt;</code></div>' },
                { bot: 'Use <span class="keyword-highlight">role</span> for custom elements:<br><div class="code-example"><code>&lt;div role="button"&gt;Click me&lt;/div&gt;</code></div>' },
                { bot: '✅ Accessible web helps everyone!' }
            ],
            exercises: [
                { type: 'fill', question: 'Describe image', code: '&lt;img src="pic.jpg" ___BLANK___="Description"&gt;', answer: 'alt' },
                { type: 'mcq', question: 'Label for input?', options: ['<label>', '<input-label>', '<for>', '<description>'], correct: 0 },
                { type: 'fill', question: 'Add description', code: '&lt;button ___BLANK___-label="Close"&gt;×&lt;/button&gt;', answer: 'aria' },
                { type: 'mcq', question: 'Semantic main content?', options: ['<div>', '<main>', '<content>', '<body>'], correct: 1 },
                { type: 'fill', question: 'Make focusable', code: '&lt;div ___BLANK___="0"&gt;Focus&lt;/div&gt;', answer: 'tabindex' }
            ]
        }
    },

    css: {
        course1: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'CSS makes websites beautiful! 🎨 It controls colors, layout, fonts.' },
                { bot: 'CSS has three parts: <span class="keyword-highlight">selector</span>, <span class="keyword-highlight">property</span>, <span class="keyword-highlight">value</span>:<br><div class="code-example"><code>h1 {<br>  color: blue;<br>  font-size: 32px;<br>}</code></div>' },
                { bot: '<strong>Selector</strong> = what to style. <strong>Property</strong> = what to change. <strong>Value</strong> = new setting.' },
                { bot: '<span class="keyword-highlight">Class selectors</span> use a dot (reusable):<br><div class="code-example"><code>.highlight {<br>  background: yellow;<br>  padding: 10px;<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Use in HTML: <code>&lt;p class="highlight"&gt;Text&lt;/p&gt;</code>' },
                { bot: '<span class="keyword-highlight">ID selectors</span> use hashtag (unique):<br><div class="code-example"><code>#main {<br>  width: 80%;<br>  margin: 0 auto;<br>}</code></div>' },
                { bot: 'Combine selectors:<br><div class="code-example"><code>div.box {        /* div with class box */<br>  border: 1px solid black;<br>}<br><br>h1, h2, h3 {     /* all headings */<br>  color: navy;<br>}</code></div>' },
                { bot: 'Universal selector * targets everything:<br><div class="code-example"><code>* {<br>  margin: 0;<br>  padding: 0;<br>}</code></div>' }
            ],
            exercises: [
                { type: 'fill', question: 'Style all paragraphs', code: '___BLANK___ {<br>  color: red;<br>}', answer: 'p' },
                { type: 'mcq', question: 'Target a class?', options: ['#name', '.name', 'name', '*name'], correct: 1 },
                { type: 'fill', question: 'Target by ID', code: '___BLANK___main { width: 100%; }', answer: '#' },
                { type: 'mcq', question: 'Select all elements?', options: ['all', '*', 'everything', '%'], correct: 1 },
                { type: 'fill', question: 'Target class "box"', code: '___BLANK___box { padding: 20px; }', answer: '.' }
            ]
        },
        course2: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Colors and backgrounds bring design to life! 🌈' },
                { bot: 'Set text color:<br><div class="code-example"><code>p {<br>  color: blue;          /* name */<br>  color: #FF5733;       /* hex */<br>  color: rgb(255, 87, 51);  /* RGB */<br>  color: rgba(255, 87, 51, 0.5);  /* with transparency */<br>}</code></div>' },
                { bot: 'Background colors:<br><div class="code-example"><code>body {<br>  background-color: lightblue;<br>  background: linear-gradient(to right, blue, purple);<br>}</code></div>' },
                { bot: 'Background images:<br><div class="code-example"><code>.hero {<br>  background-image: url(\'photo.jpg\');<br>  background-size: cover;<br>  background-position: center;<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Opacity controls transparency:<br><div class="code-example"><code>.box {<br>  opacity: 0.5;  /* 50% transparent */<br>}</code></div>' },
                { bot: 'Hex colors are common:<br>- #FF0000 = red<br>- #00FF00 = green<br>- #0000FF = blue<br>- #FFFFFF = white<br>- #000000 = black' },
                { bot: 'RGB values range 0-255 for red, green, blue.' },
                { bot: '✅ Colors create visual impact!' }
            ],
            exercises: [
                { type: 'fill', question: 'Change text color', code: 'p {<br>  ___BLANK___: blue;<br>}', answer: 'color' },
                { type: 'mcq', question: 'Which is a hex color?', options: ['blue', '#FF0000', 'rgb(255,0,0)', 'All'], correct: 1 },
                { type: 'fill', question: 'Set background', code: 'div {<br>  ___BLANK___-color: yellow;<br>}', answer: 'background' },
                { type: 'mcq', question: 'Make element 50% transparent?', options: ['transparent: 50%', 'opacity: 0.5', 'transparency: 0.5', 'alpha: 50'], correct: 1 },
                { type: 'fill', question: 'Set background image', code: 'div {<br>  background-___BLANK___: url("pic.jpg");<br>}', answer: 'image' }
            ]
        },
        course3: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'The Box Model controls spacing! 📦 Every element is a box.' },
                { bot: 'Four layers:<br>1. <span class="keyword-highlight">Content</span> - actual content<br>2. <span class="keyword-highlight">Padding</span> - space inside border<br>3. <span class="keyword-highlight">Border</span> - edge<br>4. <span class="keyword-highlight">Margin</span> - space outside' },
                { bot: 'Padding adds inside space:<br><div class="code-example"><code>.box {<br>  padding: 20px;           /* all sides */<br>  padding: 10px 20px;      /* vertical horizontal */<br>  padding: 10px 15px 20px 25px;  /* top right bottom left */<br>}</code></div>' },
                { bot: 'Margin adds outside space:<br><div class="code-example"><code>.card {<br>  margin: 20px;<br>  margin-top: 10px;<br>  margin-bottom: 30px;<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Center with <code>margin: 0 auto;</code>!' },
                { bot: 'Borders:<br><div class="code-example"><code>.box {<br>  border: 2px solid black;<br>  border-radius: 10px;  /* rounded */<br>}</code></div>' },
                { bot: 'Set dimensions:<br><div class="code-example"><code>.container {<br>  width: 300px;<br>  height: 200px;<br>  max-width: 100%;  /* responsive */<br>}</code></div>' },
                { bot: '✅ Box model controls layout!' }
            ],
            exercises: [
                { type: 'fill', question: 'Add inside spacing', code: '.box {<br>  ___BLANK___: 15px;<br>}', answer: 'padding' },
                { type: 'mcq', question: 'Outside spacing?', options: ['padding', 'margin', 'border', 'space'], correct: 1 },
                { type: 'fill', question: 'Add border', code: '.box {<br>  ___BLANK___: 1px solid black;<br>}', answer: 'border' },
                { type: 'mcq', question: 'Round corners?', options: ['corner-radius', 'round', 'border-radius', 'radius'], correct: 2 },
                { type: 'fill', question: 'Set width', code: '.container {<br>  ___BLANK___: 500px;<br>}', answer: 'width' }
            ]
        },
        course4: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Fonts and typography! ✍️ Control text appearance.' },
                { bot: '<span class="keyword-highlight">font-family</span> changes font:<br><div class="code-example"><code>body {<br>  font-family: Arial, Helvetica, sans-serif;<br>}</code></div>' },
                { bot: 'Always list multiple fonts (fallbacks)!' },
                { bot: 'Font properties:<br><div class="code-example"><code>h1 {<br>  font-size: 32px;<br>  font-weight: bold;    /* or 700 */<br>  font-style: italic;<br>  text-decoration: underline;<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Text alignment:<br><div class="code-example"><code>p {<br>  text-align: center;   /* left, right, center, justify */<br>  line-height: 1.6;     /* line spacing */<br>  letter-spacing: 2px;  /* letter spacing */<br>}</code></div>' },
                { bot: 'Text transform:<br><div class="code-example"><code>h1 {<br>  text-transform: uppercase;  /* UPPERCASE */<br>  text-transform: lowercase;  /* lowercase */<br>  text-transform: capitalize; /* Capitalize Each */<br>}</code></div>' },
                { bot: 'Import Google Fonts:<br><div class="code-example"><code>@import url(\'https://fonts.googleapis.com/css2?family=Roboto\');<br><br>body {<br>  font-family: \'Roboto\', sans-serif;<br>}</code></div>' },
                { bot: 'Font weights: 100-900 (400=normal, 700=bold).' },
                { bot: '✅ Typography affects readability!' }
            ],
            exercises: [
                { type: 'fill', question: 'Change font', code: 'body {<br>  ___BLANK___-family: Arial;<br>}', answer: 'font' },
                { type: 'mcq', question: 'Make text bold?', options: ['font-weight: bold', 'text-bold', 'bold: true', 'weight: heavy'], correct: 0 },
                { type: 'fill', question: 'Center text', code: 'p {<br>  text-___BLANK___: center;<br>}', answer: 'align' },
                { type: 'mcq', question: 'Make text uppercase?', options: ['text-transform: uppercase', 'text-upper', 'uppercase: true', 'transform: upper'], correct: 0 },
                { type: 'fill', question: 'Set font size', code: 'h1 {<br>  font-___BLANK___: 32px;<br>}', answer: 'size' }
            ]
        },
        course5: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Flexbox and Grid! 📐 Modern layout tools.' },
                { bot: '<span class="keyword-highlight">Flexbox</span> for one-dimensional layouts:<br><div class="code-example"><code>.container {<br>  display: flex;<br>  justify-content: center;  /* horizontal */<br>  align-items: center;      /* vertical */<br>}</code></div>' },
                { bot: 'Flex direction:<br><div class="code-example"><code>.container {<br>  display: flex;<br>  flex-direction: row;    /* default */<br>  flex-direction: column; /* vertical */<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">justify-content</span> options:<br>- flex-start, flex-end, center<br>- space-between, space-around' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Wrap items:<br><div class="code-example"><code>.container {<br>  display: flex;<br>  flex-wrap: wrap;<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">Grid</span> for two-dimensional:<br><div class="code-example"><code>.grid {<br>  display: grid;<br>  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal */<br>  gap: 20px;<br>}</code></div>' },
                { bot: '<strong>fr</strong> = fraction of available space.' },
                { bot: '✅ Flexbox and Grid make layout easy!' }
            ],
            exercises: [
                { type: 'fill', question: 'Enable flexbox', code: '.container {<br>  display: ___BLANK___;<br>}', answer: 'flex' },
                { type: 'mcq', question: 'Center vertically in flex?', options: ['justify-content', 'align-items', 'center', 'vertical-align'], correct: 1 },
                { type: 'fill', question: 'Enable grid', code: '.container {<br>  display: ___BLANK___;<br>}', answer: 'grid' },
                { type: 'mcq', question: 'Create grid columns?', options: ['columns', 'grid-columns', 'grid-template-columns', 'template-columns'], correct: 2 },
                { type: 'fill', question: 'Space between items', code: '.grid {<br>  ___BLANK___: 20px;<br>}', answer: 'gap' }
            ]
        },
        course6: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Responsive design adapts to screen sizes! 📱' },
                { bot: '<span class="keyword-highlight">Media queries</span>:<br><div class="code-example"><code>@media (max-width: 768px) {<br>  .sidebar {<br>    display: none;<br>  }<br>  .main {<br>    width: 100%;<br>  }<br>}</code></div>' },
                { bot: 'Common breakpoints:<br>- Mobile: max-width: 480px<br>- Tablet: max-width: 768px<br>- Desktop: max-width: 1024px<br>- Large: max-width: 1200px' },
                { bot: 'Mobile-first approach:<br><div class="code-example"><code>/* Mobile first */<br>.container {<br>  width: 100%;<br>}<br><br>/* Desktop */<br>@media (min-width: 768px) {<br>  .container {<br>    width: 750px;<br>  }<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Responsive units:<br>- <strong>%</strong>: Relative to parent<br>- <strong>vw/vh</strong>: Viewport width/height<br>- <strong>rem</strong>: Root font size<br>- <strong>em</strong>: Parent font' },
                { bot: 'Responsive images:<br><div class="code-example"><code>img {<br>  max-width: 100%;<br>  height: auto;<br>}</code></div>' },
                { bot: 'Viewport meta tag (in HTML):<br><div class="code-example"><code>&lt;meta name="viewport" <br>  content="width=device-width, initial-scale=1"&gt;</code></div>' },
                { bot: '✅ Responsive design is essential!' }
            ],
            exercises: [
                { type: 'fill', question: 'Start media query', code: '___BLANK___ (max-width: 600px) {<br>  /* styles */<br>}', answer: '@media' },
                { type: 'mcq', question: 'Responsive unit?', options: ['px', 'pt', '%', 'cm'], correct: 2 },
                { type: 'fill', question: 'Responsive image', code: 'img {<br>  ___BLANK___-width: 100%;<br>}', answer: 'max' },
                { type: 'mcq', question: 'vw stands for?', options: ['Very wide', 'Viewport width', 'View width', 'Vertical width'], correct: 1 },
                { type: 'fill', question: 'Tablet breakpoint', code: '@media (max-width: ___BLANK___px) {}', answer: '768' }
            ]
        },
        course7: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'CSS Animations! ✨ Bring pages to life.' },
                { bot: '<span class="keyword-highlight">Transitions</span> animate changes:<br><div class="code-example"><code>.button {<br>  background: blue;<br>  transition: background 0.3s;<br>}<br>.button:hover {<br>  background: red;<br>}</code></div>' },
                { bot: 'Transition all properties:<br><div class="code-example"><code>.box {<br>  transition: all 0.5s ease;<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">@keyframes</span> for complex animations:<br><div class="code-example"><code>@keyframes slideIn {<br>  from { transform: translateX(-100%); }<br>  to { transform: translateX(0); }<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Apply animations:<br><div class="code-example"><code>.element {<br>  animation: slideIn 1s ease;<br>}</code></div>' },
                { bot: 'Animation properties:<br><div class="code-example"><code>.element {<br>  animation-name: slideIn;<br>  animation-duration: 2s;<br>  animation-delay: 0.5s;<br>  animation-iteration-count: infinite;<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">Transform</span> changes appearance:<br><div class="code-example"><code>transform: rotate(45deg);<br>transform: scale(1.5);<br>transform: translate(50px, 100px);</code></div>' },
                { bot: '✅ Animations enhance user experience!' }
            ],
            exercises: [
                { type: 'fill', question: 'Add transition', code: '.box {<br>  ___BLANK___: all 0.3s;<br>}', answer: 'transition' },
                { type: 'mcq', question: 'Create keyframes?', options: ['@animation', '@keyframes', '@animate', '@frames'], correct: 1 },
                { type: 'fill', question: 'Apply animation', code: '.el {<br>  ___BLANK___: fadeIn 1s;<br>}', answer: 'animation' },
                { type: 'mcq', question: 'Rotate element?', options: ['transform: rotate()', 'rotate()', 'animation: rotate()', 'turn()'], correct: 0 },
                { type: 'fill', question: 'Scale to 2x', code: 'transform: ___BLANK___(2);', answer: 'scale' }
            ]
        },
        course8: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'CSS Variables (Custom Properties)! 🎛️ Reusable values.' },
                { bot: 'Define variables in <span class="keyword-highlight">:root</span>:<br><div class="code-example"><code>:root {<br>  --primary-color: #3498db;<br>  --spacing: 20px;<br>  --font-size: 16px;<br>}</code></div>' },
                { bot: 'Use with <span class="keyword-highlight">var()</span>:<br><div class="code-example"><code>.button {<br>  background: var(--primary-color);<br>  padding: var(--spacing);<br>}</code></div>' },
                { bot: 'Fallback values:<br><div class="code-example"><code>color: var(--text-color, black);</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Change variables with JavaScript:<br><div class="code-example"><code>document.documentElement.style<br>  .setProperty(\'--primary-color\', \'red\');</code></div>' },
                { bot: 'Scope variables locally:<br><div class="code-example"><code>.card {<br>  --card-padding: 15px;<br>  padding: var(--card-padding);<br>}</code></div>' },
                { bot: 'Great for themes:<br><div class="code-example"><code>:root {<br>  --bg: white;<br>  --text: black;<br>}<br>.dark-theme {<br>  --bg: black;<br>  --text: white;<br>}</code></div>' },
                { bot: '✅ Variables make CSS maintainable!' }
            ],
            exercises: [
                { type: 'fill', question: 'Define CSS variable', code: ':root {<br>  ___BLANK___-color: blue;<br>}', answer: '--' },
                { type: 'mcq', question: 'Use CSS variable?', options: ['var(--name)', 'variable(name)', '$(name)', '@name'], correct: 0 },
                { type: 'fill', question: 'Use variable', code: 'color: ___BLANK___(--primary);', answer: 'var' },
                { type: 'mcq', question: 'Variable with fallback?', options: ['var(--col, red)', 'var(--col || red)', 'var(--col : red)', 'var(--col -> red)'], correct: 0 },
                { type: 'fill', question: 'Define in root', code: '___BLANK___ {<br>  --size: 20px;<br>}', answer: ':root' }
            ]
        },
        course9: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Pseudo-classes style element states! 🎭 Dynamic styling.' },
                { bot: '<span class="keyword-highlight">:hover</span> on mouse over:<br><div class="code-example"><code>button:hover {<br>  background: blue;<br>  transform: scale(1.1);<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">:active</span> while clicking:<br><div class="code-example"><code>button:active {<br>  transform: scale(0.95);<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">:focus</span> when focused:<br><div class="code-example"><code>input:focus {<br>  outline: 2px solid blue;<br>  border-color: blue;<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">:nth-child()</span> selects by position:<br><div class="code-example"><code>li:nth-child(odd) {<br>  background: lightgray;<br>}<br>li:nth-child(3) {<br>  color: red;  /* 3rd item */<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">:first-child</span> and <span class="keyword-highlight">:last-child</span>:<br><div class="code-example"><code>p:first-child {<br>  font-weight: bold;<br>}<br>p:last-child {<br>  margin-bottom: 0;<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">:not()</span> excludes elements:<br><div class="code-example"><code>button:not(.primary) {<br>  background: gray;<br>}</code></div>' },
                { bot: '✅ Pseudo-classes add interactivity!' }
            ],
            exercises: [
                { type: 'fill', question: 'Style on hover', code: 'a___BLANK___ {<br>  color: red;<br>}', answer: ':hover' },
                { type: 'mcq', question: 'Style first element?', options: [':first', ':first-child', ':nth(1)', ':child(1)'], correct: 1 },
                { type: 'fill', question: 'Style odd children', code: 'li:nth-child(___BLANK___) {}', answer: 'odd' },
                { type: 'mcq', question: 'Exclude elements?', options: [':except()', ':not()', ':exclude()', ':without()'], correct: 1 },
                { type: 'fill', question: 'Style when focused', code: 'input___BLANK___ {<br>  border: blue;<br>}', answer: ':focus' }
            ]
        },
        course10: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Advanced CSS Grid! 🎨 Complex layouts made easy.' },
                { bot: '<span class="keyword-highlight">Grid template areas</span> name sections:<br><div class="code-example"><code>.container {<br>  display: grid;<br>  grid-template-areas:<br>    "header header"<br>    "sidebar content"<br>    "footer footer";<br>}</code></div>' },
                { bot: 'Assign elements to areas:<br><div class="code-example"><code>.header { grid-area: header; }<br>.sidebar { grid-area: sidebar; }<br>.content { grid-area: content; }</code></div>' },
                { bot: '<span class="keyword-highlight">repeat()</span> for columns:<br><div class="code-example"><code>grid-template-columns: repeat(3, 1fr);</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">minmax()</span> sets size range:<br><div class="code-example"><code>grid-template-columns: repeat(3, minmax(200px, 1fr));</code></div>' },
                { bot: 'Auto-fit and auto-fill:<br><div class="code-example"><code>grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));</code></div>' },
                { bot: 'Grid gap spacing:<br><div class="code-example"><code>gap: 20px;<br>row-gap: 10px;<br>column-gap: 15px;</code></div>' },
                { bot: '✅ Grid makes complex layouts simple!' }
            ],
            exercises: [
                { type: 'fill', question: 'Name grid areas', code: '.container {<br>  grid-template-___BLANK___: "header";<br>}', answer: 'areas' },
                { type: 'mcq', question: 'Assign to area?', options: ['grid-area', 'area', 'grid-assign', 'template-area'], correct: 0 },
                { type: 'fill', question: 'Repeat columns', code: 'grid-template-columns: ___BLANK___(3, 1fr);', answer: 'repeat' },
                { type: 'mcq', question: 'Flexible size range?', options: ['range()', 'minmax()', 'flex()', 'size()'], correct: 1 },
                { type: 'fill', question: 'Set spacing', code: '___BLANK___: 20px;', answer: 'gap' }
            ]
        }
    },

    react: {
        course1: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'React builds user interfaces with components! ⚛️' },
                { bot: 'A <span class="keyword-highlight">component</span> is reusable UI:<br><div class="code-example"><code>function Welcome() {<br>  return &lt;h1&gt;Hello React!&lt;/h1&gt;;<br>}</code></div>' },
                { bot: 'Components are functions that return <span class="keyword-highlight">JSX</span>!' },
                { bot: '<span class="keyword-highlight">JSX</span> looks like HTML but is JavaScript:<br><div class="code-example"><code>const element = &lt;h1&gt;Hello!&lt;/h1&gt;;<br>const name = "Alice";<br>const greeting = &lt;p&gt;Hi, {name}&lt;/p&gt;;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Use curly braces {} for JavaScript in JSX!' },
                { bot: 'Components must return single parent:<br><div class="code-example"><code>// Wrong ❌<br>return (<br>  &lt;h1&gt;Title&lt;/h1&gt;<br>  &lt;p&gt;Text&lt;/p&gt;<br>)<br><br>// Correct ✅<br>return (<br>  &lt;div&gt;<br>    &lt;h1&gt;Title&lt;/h1&gt;<br>    &lt;p&gt;Text&lt;/p&gt;<br>  &lt;/div&gt;<br>)</code></div>' },
                { bot: 'Or use <span class="keyword-highlight">fragments</span> to avoid extra divs:<br><div class="code-example"><code>return (<br>  &lt;&gt;<br>    &lt;h1&gt;Title&lt;/h1&gt;<br>    &lt;p&gt;Text&lt;/p&gt;<br>  &lt;/&gt;<br>)</code></div>' },
                { bot: '✅ Components make UI reusable!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create component', code: '___BLANK___ App() {<br>  return &lt;div&gt;Hi&lt;/div&gt;;<br>}', answer: 'function' },
                { type: 'mcq', question: 'What is JSX?', options: ['CSS', 'HTML-like JavaScript', 'JSON', 'XML'], correct: 1 },
                { type: 'fill', question: 'Embed JavaScript', code: '&lt;p&gt;Count: ___BLANK___count}&lt;/p&gt;', answer: '{' },
                { type: 'mcq', question: 'Wrap multiple elements without div?', options: ['<wrap>', '<>', '<group>', '<span>'], correct: 1 },
                { type: 'fill', question: 'Return JSX', code: 'function App() {<br>  ___BLANK___ &lt;div&gt;Hi&lt;/div&gt;;<br>}', answer: 'return' }
            ]
        },
        course2: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Props pass data between components! 📬 Like function parameters.' },
                { bot: 'Send props when using component:<br><div class="code-example"><code>&lt;Greeting name="Alice" age={25} /&gt;</code></div>' },
                { bot: 'Strings use quotes, everything else uses braces!' },
                { bot: 'Receive props as parameter:<br><div class="code-example"><code>function Greeting(props) {<br>  return (<br>    &lt;div&gt;<br>      &lt;h1&gt;Hello {props.name}!&lt;/h1&gt;<br>      &lt;p&gt;Age: {props.age}&lt;/p&gt;<br>    &lt;/div&gt;<br>  );<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">Destructure</span> props:<br><div class="code-example"><code>function Greeting({name, age}) {<br>  return &lt;h1&gt;Hello {name}, age {age}!&lt;/h1&gt;;<br>}</code></div>' },
                { bot: 'Props can be any type:<br>- Strings: "text"<br>- Numbers: {42}<br>- Booleans: {true}<br>- Arrays: {[1, 2, 3]}<br>- Objects: { {key: "value"} }<br>- Functions: {handleClick}' },
                { bot: 'Props are <strong>read-only</strong> - never change them!' },
                { bot: '✅ Props enable component communication!' }
            ],
            exercises: [
                { type: 'fill', question: 'Access prop', code: 'function Card(props) {<br>  return &lt;p&gt;{props.___BLANK___}&lt;/p&gt;;<br>}', answer: 'title' },
                { type: 'mcq', question: 'Pass number prop?', options: ['num="5"', 'num={5}', 'num=(5)', 'num:5'], correct: 1 },
                { type: 'fill', question: 'Destructure props', code: 'function Card(___BLANK___name, age}) {<br>  return &lt;p&gt;{name}&lt;/p&gt;;<br>}', answer: '{' },
                { type: 'mcq', question: 'Can you modify props?', options: ['Yes', 'No', 'Sometimes', 'Only numbers'], correct: 1 },
                { type: 'fill', question: 'Pass string prop', code: '&lt;Card title___BLANK___"Hello" /&gt;', answer: '=' }
            ]
        },
        course3: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'State makes components dynamic! 🔄' },
                { bot: 'Import <span class="keyword-highlight">useState</span>:<br><div class="code-example"><code>import { useState } from "react";</code></div>' },
                { bot: 'Create state:<br><div class="code-example"><code>const [count, setCount] = useState(0);<br>// count = current value<br>// setCount = update function<br>// 0 = initial value</code></div>' },
                { bot: 'Update state:<br><div class="code-example"><code>function Counter() {<br>  const [count, setCount] = useState(0);<br>  <br>  return (<br>    &lt;button onClick={() => setCount(count + 1)}&gt;<br>      Clicks: {count}<br>    &lt;/button&gt;<br>  );<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'State changes cause re-renders!' },
                { bot: 'Multiple state variables:<br><div class="code-example"><code>const [name, setName] = useState("");<br>const [age, setAge] = useState(0);<br>const [active, setActive] = useState(false);</code></div>' },
                { bot: 'State can be any type!' },
                { bot: '<strong>Never</strong> modify state directly - always use setter:<br><div class="code-example"><code>// Wrong ❌<br>count = count + 1;<br><br>// Correct ✅<br>setCount(count + 1);</code></div>' },
                { bot: '✅ State enables dynamic UIs!' }
            ],
            exercises: [
                { type: 'fill', question: 'Import useState', code: 'import { ___BLANK___ } from "react";', answer: 'useState' },
                { type: 'mcq', question: 'Update state?', options: ['setState', 'updateState', 'setCount', 'changeState'], correct: 2 },
                { type: 'fill', question: 'Create state', code: 'const [val, setVal] = ___BLANK___(0);', answer: 'useState' },
                { type: 'mcq', question: 'What happens when state changes?', options: ['Nothing', 'Component re-renders', 'Page reloads', 'Error'], correct: 1 },
                { type: 'fill', question: 'Update state', code: '___BLANK___(count + 1);', answer: 'setCount' }
            ]
        },
        course4: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Events handle user interactions! 🎯' },
                { bot: '<span class="keyword-highlight">onClick</span> is most common:<br><div class="code-example"><code>&lt;button onClick={handleClick}&gt;<br>  Click Me<br>&lt;/button&gt;</code></div>' },
                { bot: 'Define event handlers:<br><div class="code-example"><code>function App() {<br>  const handleClick = () => {<br>    alert("Clicked!");<br>  };<br>  <br>  return &lt;button onClick={handleClick}&gt;Click&lt;/button&gt;;<br>}</code></div>' },
                { bot: 'Or use inline:<br><div class="code-example"><code>&lt;button onClick={() => alert("Hi")}&gt;<br>  Click<br>&lt;/button&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Handle input with <span class="keyword-highlight">onChange</span>:<br><div class="code-example"><code>function Form() {<br>  const [text, setText] = useState("");<br>  <br>  return (<br>    &lt;input <br>      value={text}<br>      onChange={(e) => setText(e.target.value)}<br>    /&gt;<br>  );<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">Event object</span> properties:<br>- e.target: Triggered element<br>- e.target.value: Input value<br>- e.preventDefault(): Stop default' },
                { bot: 'Common events:<br>- onClick, onChange, onSubmit<br>- onMouseEnter, onKeyPress, onFocus' },
                { bot: '✅ Events make React interactive!' }
            ],
            exercises: [
                { type: 'fill', question: 'Add click handler', code: '&lt;button ___BLANK___={doSomething}&gt;', answer: 'onClick' },
                { type: 'mcq', question: 'Get input value in event?', options: ['e.value', 'e.target.value', 'e.input', 'e.getValue()'], correct: 1 },
                { type: 'fill', question: 'Handle input change', code: '&lt;input ___BLANK___={(e) => setText(e.target.value)} /&gt;', answer: 'onChange' },
                { type: 'mcq', question: 'Prevent default behavior?', options: ['e.stop()', 'e.preventDefault()', 'e.cancel()', 'e.block()'], correct: 1 },
                { type: 'fill', question: 'Handle form submit', code: '&lt;form ___BLANK___={handleSubmit}&gt;', answer: 'onSubmit' }
            ]
        },
        course5: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Conditional rendering shows different UI! 🔀' },
                { bot: 'Use <span class="keyword-highlight">if statements</span>:<br><div class="code-example"><code>function Greeting({isLoggedIn}) {<br>  if (isLoggedIn) {<br>    return &lt;h1&gt;Welcome back!&lt;/h1&gt;;<br>  }<br>  return &lt;h1&gt;Please log in&lt;/h1&gt;;<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">Ternary operator</span> is shorter:<br><div class="code-example"><code>function App({isLoggedIn}) {<br>  return (<br>    &lt;div&gt;<br>      {isLoggedIn ? (<br>        &lt;Dashboard /&gt;<br>      ) : (<br>        &lt;Login /&gt;<br>      )}<br>    &lt;/div&gt;<br>  );<br>}</code></div>' },
                { bot: 'Logical <span class="keyword-highlight">&&</span> for simple conditions:<br><div class="code-example"><code>{hasError && &lt;ErrorMessage /&gt;}<br>{count > 0 && &lt;p&gt;Count: {count}&lt;/p&gt;}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'If true, renders. If false, nothing renders!' },
                { bot: 'Conditionally set attributes:<br><div class="code-example"><code>&lt;button <br>  className={isActive ? "active" : "inactive"}<br>  disabled={!canSubmit}<br>&gt;<br>  Submit<br>&lt;/button&gt;</code></div>' },
                { bot: 'Combine multiple conditions:<br><div class="code-example"><code>{isLoggedIn && hasAccess && &lt;AdminPanel /&gt;}<br>{status === "loading" && &lt;Spinner /&gt;}<br>{error ? &lt;Error msg={error} /&gt; : &lt;Content /&gt;}</code></div>' },
                { bot: '✅ Conditionals create dynamic UIs!' }
            ],
            exercises: [
                { type: 'fill', question: 'Conditional with &&', code: '{isActive ___BLANK___ &lt;div&gt;Active&lt;/div&gt;}', answer: '&&' },
                { type: 'mcq', question: 'Ternary operator syntax?', options: ['if-else', '? :', '&&', '||'], correct: 1 },
                { type: 'fill', question: 'Map over array', code: '{items.___BLANK___(item => &lt;li&gt;{item}&lt;/li&gt;)}', answer: 'map' },
                { type: 'mcq', question: 'Required prop when rendering lists?', options: ['id', 'key', 'index', 'unique'], correct: 1 },
                { type: 'fill', question: 'Ternary condition', code: '{isReady ___BLANK___ &lt;Start /&gt; : &lt;Wait /&gt;}', answer: '?' }
            ]
        },
        course6: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Lists display multiple items! 📋 Perfect for dynamic content.' },
                { bot: 'Use <span class="keyword-highlight">.map()</span> to render arrays:<br><div class="code-example"><code>const fruits = ["apple", "banana", "orange"];<br><br>return (<br>  &lt;ul&gt;<br>    {fruits.map((fruit, index) => (<br>      &lt;li key={index}&gt;{fruit}&lt;/li&gt;<br>    ))}<br>  &lt;/ul&gt;<br>);</code></div>' },
                { bot: 'Always add <span class="keyword-highlight">key</span> prop - helps React track items!' },
                { bot: 'Render array of objects:<br><div class="code-example"><code>const users = [<br>  { id: 1, name: "Alice" },<br>  { id: 2, name: "Bob" }<br>];<br><br>return (<br>  &lt;div&gt;<br>    {users.map(user => (<br>      &lt;p key={user.id}&gt;{user.name}&lt;/p&gt;<br>    ))}<br>  &lt;/div&gt;<br>);</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Use unique IDs for keys, not array indices when possible!' },
                { bot: 'Filter arrays before mapping:<br><div class="code-example"><code>const activeUsers = users.filter(u => u.active);<br><br>return (<br>  &lt;div&gt;<br>    {activeUsers.map(user => (<br>      &lt;Card key={user.id} data={user} /&gt;<br>    ))}<br>  &lt;/div&gt;<br>);</code></div>' },
                { bot: 'Combine map with conditional rendering:<br><div class="code-example"><code>{items.length > 0 ? (<br>  items.map(item => &lt;div key={item.id}&gt;{item.name}&lt;/div&gt;)<br>) : (<br>  &lt;p&gt;No items&lt;/p&gt;<br>)}</code></div>' },
                { bot: 'Extract list items into separate components for cleaner code!' },
                { bot: '✅ Lists are essential for dynamic data!' }
            ],
            exercises: [
                { type: 'fill', question: 'Render array items', code: '{items.___BLANK___(item => &lt;div&gt;{item}&lt;/div&gt;)}', answer: 'map' },
                { type: 'mcq', question: 'Required for list items?', options: ['id', 'key', 'index', 'name'], correct: 1 },
                { type: 'fill', question: 'Add key to list item', code: '&lt;li ___BLANK___={item.id}&gt;{item.name}&lt;/li&gt;', answer: 'key' },
                { type: 'mcq', question: 'Filter items before rendering?', options: ['.filter()', '.select()', '.where()', '.get()'], correct: 0 },
                { type: 'fill', question: 'Map with index', code: '{arr.map((item, ___BLANK___) => ...)}', answer: 'index' }
            ]
        },
        course7: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'useEffect runs code after render! 🪝 Perfect for side effects.' },
                { bot: 'Import useEffect:<br><div class="code-example"><code>import { useState, useEffect } from "react";</code></div>' },
                { bot: 'Basic useEffect runs after every render:<br><div class="code-example"><code>useEffect(() => {<br>  console.log("Component rendered!");<br>});</code></div>' },
                { bot: 'Add <span class="keyword-highlight">dependency array</span> to control when it runs:<br><div class="code-example"><code>useEffect(() => {<br>  console.log("Count changed!");<br>}, [count]);  // Only runs when count changes</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Empty array [] runs only once (on mount):<br><div class="code-example"><code>useEffect(() => {<br>  console.log("Component mounted!");<br>}, []);</code></div>' },
                { bot: 'Fetch data with useEffect:<br><div class="code-example"><code>useEffect(() => {<br>  fetch("api.com/data")<br>    .then(res => res.json())<br>    .then(data => setData(data));<br>}, []);</code></div>' },
                { bot: '<span class="keyword-highlight">Cleanup function</span> runs before unmount:<br><div class="code-example"><code>useEffect(() => {<br>  const timer = setInterval(() => {}, 1000);<br>  return () => clearInterval(timer);<br>}, []);</code></div>' },
                { bot: 'Common use cases:<br>- Fetch data from APIs<br>- Set up subscriptions<br>- Manually change DOM<br>- Set up timers' },
                { bot: '✅ useEffect handles side effects perfectly!' }
            ],
            exercises: [
                { type: 'fill', question: 'Import useEffect', code: 'import { ___BLANK___ } from "react";', answer: 'useEffect' },
                { type: 'mcq', question: 'When does useEffect run with []?', options: ['Every render', 'Once on mount', 'Never', 'On unmount'], correct: 1 },
                { type: 'fill', question: 'Add dependency', code: 'useEffect(() => {}, ___BLANK___count]);', answer: '[' },
                { type: 'mcq', question: 'What does cleanup function do?', options: ['Deletes component', 'Runs before unmount', 'Cleans state', 'Resets props'], correct: 1 },
                { type: 'fill', question: 'Complete useEffect syntax', code: '___BLANK___(() => {});', answer: 'useEffect' }
            ]
        },
        course8: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Custom Hooks reuse logic! 🔧 Keep code DRY.' },
                { bot: 'Custom hooks are functions starting with "use":<br><div class="code-example"><code>function useCounter(initialValue = 0) {<br>  const [count, setCount] = useState(initialValue);<br>  <br>  const increment = () => setCount(count + 1);<br>  const decrement = () => setCount(count - 1);<br>  <br>  return { count, increment, decrement };<br>}</code></div>' },
                { bot: 'Use your custom hook:<br><div class="code-example"><code>function Counter() {<br>  const { count, increment, decrement } = useCounter(0);<br>  <br>  return (<br>    &lt;div&gt;<br>      &lt;p&gt;Count: {count}&lt;/p&gt;<br>      &lt;button onClick={increment}&gt;+&lt;/button&gt;<br>      &lt;button onClick={decrement}&gt;-&lt;/button&gt;<br>    &lt;/div&gt;<br>  );<br>}</code></div>' },
                { bot: 'Custom hooks can use other hooks!' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: '<span class="keyword-highlight">useLocalStorage</span> example:<br><div class="code-example"><code>function useLocalStorage(key, initialValue) {<br>  const [value, setValue] = useState(() => {<br>    const item = localStorage.getItem(key);<br>    return item ? JSON.parse(item) : initialValue;<br>  });<br>  <br>  useEffect(() => {<br>    localStorage.setItem(key, JSON.stringify(value));<br>  }, [key, value]);<br>  <br>  return [value, setValue];<br>}</code></div>' },
                { bot: 'Benefits of custom hooks:<br>- Reuse logic across components<br>- Keep components simple<br>- Easier testing<br>- Better organization' },
                { bot: '✅ Custom hooks = cleaner code!' }
            ],
            exercises: [
                { type: 'fill', question: 'Custom hook name', code: 'function ___BLANK___Counter() {}', answer: 'use' },
                { type: 'mcq', question: 'Can custom hooks use useState?', options: ['No', 'Yes', 'Sometimes', 'Only once'], correct: 1 },
                { type: 'fill', question: 'Return from custom hook', code: '___BLANK___ { count, increment };', answer: 'return' },
                { type: 'mcq', question: 'Custom hooks must start with?', options: ['hook', 'use', 'custom', 'my'], correct: 1 },
                { type: 'fill', question: 'Use custom hook', code: 'const { count } = ___BLANK___();', answer: 'useCounter' }
            ]
        },
        course9: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'Context API manages global state! 🌍 No prop drilling.' },
                { bot: 'Create context:<br><div class="code-example"><code>import { createContext } from "react";<br><br>const ThemeContext = createContext();</code></div>' },
                { bot: 'Provide context value:<br><div class="code-example"><code>function App() {<br>  const [theme, setTheme] = useState("light");<br>  <br>  return (<br>    &lt;ThemeContext.Provider value={{ theme, setTheme }}&gt;<br>      &lt;Child /&gt;<br>    &lt;/ThemeContext.Provider&gt;<br>  );<br>}</code></div>' },
                { bot: 'Consume with <span class="keyword-highlight">useContext</span>:<br><div class="code-example"><code>import { useContext } from "react";<br><br>function Child() {<br>  const { theme, setTheme } = useContext(ThemeContext);<br>  <br>  return (<br>    &lt;button onClick={() => setTheme("dark")}&gt;<br>      Current: {theme}<br>    &lt;/button&gt;<br>  );<br>}</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'No need to pass props through every level!' },
                { bot: 'Multiple contexts:<br><div class="code-example"><code>&lt;UserContext.Provider value={user}&gt;<br>  &lt;ThemeContext.Provider value={theme}&gt;<br>    &lt;App /&gt;<br>  &lt;/ThemeContext.Provider&gt;<br>&lt;/UserContext.Provider&gt;</code></div>' },
                { bot: 'Common use cases:<br>- Theme switching<br>- User authentication<br>- Language/localization<br>- Shopping cart' },
                { bot: '✅ Context = no prop drilling!' }
            ],
            exercises: [
                { type: 'fill', question: 'Create context', code: 'const ThemeContext = ___BLANK___();', answer: 'createContext' },
                { type: 'mcq', question: 'Consume context?', options: ['getContext', 'useContext', 'readContext', 'contextValue'], correct: 1 },
                { type: 'fill', question: 'Provide context', code: '&lt;ThemeContext.___BLANK___ value={theme}&gt;', answer: 'Provider' },
                { type: 'mcq', question: 'Import createContext from?', options: ['context', 'react', 'react-context', 'hooks'], correct: 1 },
                { type: 'fill', question: 'Use context hook', code: 'const theme = ___BLANK___(ThemeContext);', answer: 'useContext' }
            ]
        },
        course10: {
            videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
            learn: [
                { bot: 'React Router enables navigation! 🧭 Multiple pages in single-page apps.' },
                { bot: 'Install React Router:<br><div class="code-example"><code>npm install react-router-dom</code></div>' },
                { bot: 'Setup <span class="keyword-highlight">BrowserRouter</span>:<br><div class="code-example"><code>import { BrowserRouter, Routes, Route } from "react-router-dom";<br><br>function App() {<br>  return (<br>    &lt;BrowserRouter&gt;<br>      &lt;Routes&gt;<br>        &lt;Route path="/" element={&lt;Home /&gt;} /&gt;<br>      &lt;/Routes&gt;<br>    &lt;/BrowserRouter&gt;<br>  );<br>}</code></div>' },
                { bot: '<span class="keyword-highlight">Link</span> component for navigation:<br><div class="code-example"><code>import { Link } from "react-router-dom";<br><br>&lt;Link to="/about"&gt;About&lt;/Link&gt;</code></div>' },
                { bot: '🎥 Want to watch a video to help you understand this topic better?', video: true },
                { bot: 'Dynamic routes with parameters:<br><div class="code-example"><code>&lt;Route path="/user/:id" element={&lt;User /&gt;} /&gt;</code></div>' },
                { bot: 'Access route params:<br><div class="code-example"><code>import { useParams } from "react-router-dom";<br><br>function User() {<br>  const { id } = useParams();<br>  return &lt;h1&gt;User {id}&lt;/h1&gt;;<br>}</code></div>' },
                { bot: 'Programmatic navigation:<br><div class="code-example"><code>import { useNavigate } from "react-router-dom";<br><br>const navigate = useNavigate();<br>navigate("/home");</code></div>' },
                { bot: '✅ Routing creates multi-page feel!' }
            ],
            exercises: [
                { type: 'fill', question: 'Setup router', code: '&lt;___BLANK___&gt;<br>  &lt;Routes /&gt;<br>&lt;/BrowserRouter&gt;', answer: 'BrowserRouter' },
                { type: 'mcq', question: 'Navigate between pages?', options: ['<a>', '<Link>', '<Nav>', '<Navigate>'], correct: 1 },
                { type: 'fill', question: 'Define route', code: '&lt;___BLANK___ path="/" element={&lt;Home /&gt;} /&gt;', answer: 'Route' },
                { type: 'mcq', question: 'Get route parameters?', options: ['useParams', 'useRoute', 'getParams', 'useURL'], correct: 0 },
                { type: 'fill', question: 'Navigate programmatically', code: 'const navigate = ___BLANK___();', answer: 'useNavigate' }
            ]
        }
    }
};
