import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { MessageCircle, Send, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { quickReplies } from "../types/chat";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Thank you for your message. I'll help you with that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleQuickReply = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I understand you're asking about " + message.toLowerCase() + ". Let me help you with that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#2D7A3E] text-white shadow-lg flex items-center justify-center hover:bg-[#246832] transition-colors z-50 group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        {/* Pulse Animation */}
        <span className="absolute w-full h-full rounded-full bg-[#2D7A3E] animate-ping opacity-75" />
      </button>

      {/* Chat Modal */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Kitchen Assistant</SheetTitle>
            </SheetHeader>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      {message.type === "assistant" && (
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleFeedback(message.id, "up")}
                          >
                            <ThumbsUp
                              className={`h-4 w-4 ${
                                message.feedback === "up" ? "text-primary" : ""
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleFeedback(message.id, "down")}
                          >
                            <ThumbsDown
                              className={`h-4 w-4 ${
                                message.feedback === "down" ? "text-primary" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Reply Buttons */}
            <div className="p-4 border-t bg-background">
              <div className="flex flex-wrap gap-2 mb-4">
                {quickReplies.map((reply) => (
                  <Button
                    key={reply.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply.message)}
                    className="text-xs"
                  >
                    {reply.label}
                  </Button>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatButton;