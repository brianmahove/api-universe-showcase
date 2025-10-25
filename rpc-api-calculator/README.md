# RPC Calculator

A simple Python project demonstrating Remote Procedure Call (RPC) using Python's built-in `xmlrpc` library.

## Quick Start

### 1. Start Server
```bash
python server.py
```
*Output:*
```
RPC Calculator Server is running on localhost:8000
Available methods: add, subtract, multiply, divide
Press Ctrl+C to stop the server...
```

### 2. Run Client (new terminal)
```bash
python client.py
```
*Output:*
```
RPC Calculator Client
Connected to server at localhost:8000
Available operations: +, -, *, /
Type 'exit' to quit
```

## Usage Example

**Client:**
```
Enter operation (+, -, *, /) or 'exit': +
Enter first number: 15
Enter second number: 7
Result: 22.0
```

**Server Logs:**
```
Client requested: 15.0 + 7.0
Returning result: 22.0
```

## Features

- ➕ Add, ➖ Subtract, ✖️ Multiply, ➗ Divide
- 🔄 Multiple calculations per session
- 🛡️ Division by zero protection
- 📡 Real-time server logging

## How RPC Works

1. Client calls `proxy.add(5, 3)` 
2. Method call serialized to XML
3. HTTP POST sent to server
4. Server executes method and returns XML response
5. Client receives and deserializes result

## Files

- `server.py` - RPC server with calculator methods
- `client.py` - Interactive client for remote calls

## Requirements

- Python 3.6+
- Built-in `xmlrpc` library
- Port 8000 available

**Note:** Run server first, then client in separate terminals.