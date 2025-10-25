import xmlrpc.client

# How RPC communication works:
# The client creates a proxy object that represents the remote server
# When you call methods on this proxy, it:
# 1. Serializes the method name and parameters into XML format
# 2. Sends an HTTP POST request to the server
# 3. Receives the XML response from the server
# 4. Deserializes the XML back into Python objects
# 5. Returns the result as if it were a local function call

def main():
    # Create a proxy object that connects to the RPC server
    # This proxy will translate method calls into remote procedure calls
    proxy = xmlrpc.client.ServerProxy('http://localhost:8000')
    
    print("RPC Calculator Client")
    print("Connected to server at localhost:8000")
    print("Available operations: +, -, *, /")
    print("Type 'exit' to quit\n")
    
    while True:
        try:
            # Get user input
            operation = input("Enter operation (+, -, *, /) or 'exit': ").strip().lower()
            
            if operation == 'exit':
                print("Goodbye!")
                break
            
            if operation not in ['+', '-', '*', '/']:
                print("Invalid operation. Please use +, -, *, or /")
                continue
            
            # Get numbers from user
            try:
                a = float(input("Enter first number: "))
                b = float(input("Enter second number: "))
            except ValueError:
                print("Please enter valid numbers!")
                continue
            
            # Call the appropriate remote procedure based on operation
            # The proxy object handles all the network communication transparently
            if operation == '+':
                result = proxy.add(a, b)
            elif operation == '-':
                result = proxy.subtract(a, b)
            elif operation == '*':
                result = proxy.multiply(a, b)
            elif operation == '/':
                result = proxy.divide(a, b)
            
            print(f"Result: {result}\n")
            
        except xmlrpc.client.Fault as error:
            print(f"Server error: {error.faultString}")
        except ConnectionRefusedError:
            print("Error: Cannot connect to the server. Make sure server.py is running!")
            break
        except ValueError as e:
            print(f"Error: {e}")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break

if __name__ == "__main__":
    main()