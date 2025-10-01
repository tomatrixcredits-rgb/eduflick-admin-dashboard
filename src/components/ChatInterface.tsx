import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Student } from "../types/student";
import { getMessagesByStudentId, sendMessage, subscribeToMessages } from "../services/messageService";
import { mockMessages } from "../data/mockData";

interface ChatInterfaceProps {
  student: Student;
}

export const ChatInterface = ({ student }: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages.filter(msg => msg.studentId === student.id));
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const unsubscribe = subscribeToMessages(student.id, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [student.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessagesByStudentId(student.id);
      if (data.length > 0) {
        setMessages(data);
      } else {
        setMessages(mockMessages.filter(msg => msg.studentId === student.id));
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages(mockMessages.filter(msg => msg.studentId === student.id));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const message = {
        studentId: student.id,
        sender: 'admin' as const,
        content: newMessage,
        timestamp: new Date().toISOString(),
        isAdminNote: false,
      };

      await sendMessage(message);
      setNewMessage("");
    } catch (err) {
      console.error('Error sending message:', err);
      const tempMessage = {
        id: Date.now().toString(),
        studentId: student.id,
        sender: 'admin' as const,
        content: newMessage,
        timestamp: new Date().toISOString(),
        isAdminNote: false,
      };
      setMessages([...messages, tempMessage]);
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl border shadow-soft h-full flex flex-col">
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.courseName}</p>
          </div>
          <div className="ml-auto">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {!loading && messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'student' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`max-w-[70%] ${message.isAdminNote ? 'w-full' : ''}`}>
              {message.isAdminNote ? (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30 text-xs">
                      Admin Note
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{message.content}</p>
                </div>
              ) : (
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.sender === 'admin'
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              )}
            </div>

            {message.sender === 'admin' && !message.isAdminNote && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message or admin note..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
            className="flex-1"
            disabled={sending}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            disabled={sending || !newMessage.trim()}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};