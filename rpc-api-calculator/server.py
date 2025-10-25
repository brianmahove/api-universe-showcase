from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

# Restrict to a particular path for security
class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/RPC2',)

# Create the RPC server
server = SimpleXMLRPCServer(('localhost', 8000), 
                           requestHandler=RequestHandler,
                           allow_none=True)

# Register the server instance to allow introspection
server.register_introspection_functions()

class Calculator:
    """Calculator class that exposes methods for remote procedure calls"""
    
    def add(self, a, b):
        """Add two numbers and return the result"""
        print(f"Client requested: {a} + {b}")
        result = a + b
        print(f"Returning result: {result}")
        return result
    
    def subtract(self, a, b):
        """Subtract b from a and return the result"""
        print(f"Client requested: {a} - {b}")
        result = a - b
        print(f"Returning result: {result}")
        return result
    
    def multiply(self, a, b):
        """Multiply two numbers and return the result"""
        print(f"Client requested: {a} * {b}")
        result = a * b
        print(f"Returning result: {result}")
        return result
    
    def divide(self, a, b):
        """Divide a by b and return the result"""
        print(f"Client requested: {a} / {b}")
        if b == 0:
            print("Error: Division by zero attempted")
            raise ValueError("Cannot divide by zero!")
        result = a / b
        print(f"Returning result: {result}")
        return result

# Register an instance of the Calculator class
calculator = Calculator()
server.register_instance(calculator)

# Register individual functions as well (alternative approach)
server.register_function(calculator.add, 'add')
server.register_function(calculator.subtract, 'subtract')
server.register_function(calculator.multiply, 'multiply')
server.register_function(calculator.divide, 'divide')

print("RPC Calculator Server is running on localhost:8000")
print("Available methods: add, subtract, multiply, divide")
print("Press Ctrl+C to stop the server...")

# How RPC communication works:
# 1. Client sends an XML-RPC request over HTTP containing method name and parameters
# 2. Server receives the request, parses the XML, and calls the appropriate method
# 3. Server executes the method and returns the result as XML-RPC response
# 4. Client receives the XML response and parses it to get the result

try:
    # Run the server's main loop
    server.serve_forever()
except KeyboardInterrupt:
    print("\nShutting down the RPC server...")