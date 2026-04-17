import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ToastProvider";
import { 
  Mail, 
  MapPin, 
  Send, 
  Github, 
  Twitter, 
  Linkedin, 
  MessageSquare,
  Terminal,
  ArrowLeft
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const toEmail = "support@clashofcode.com";
    const emailSubject = encodeURIComponent(formData.subject);
    const emailBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    const mailtoLink = `mailto:${toEmail}?subject=${emailSubject}&body=${emailBody}`;

    window.location.href = mailtoLink;

    toast.success("Opening your default mail client...");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-gray-300 font-sans relative overflow-hidden flex flex-col items-center py-16 px-4 md:px-8">
      
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-sm cursor-pointer font-semibold text-gray-400 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#F2613F] blur-[150px] opacity-10 pointer-events-none rounded-full"></div>

      <div className="max-w-6xl w-full z-10 space-y-12 mt-8 md:mt-0">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-[#18181b] border border-[#27272a] rounded-2xl mb-4 shadow-lg">
            <Terminal className="w-8 h-8 text-[#F2613F]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Get in Touch
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Found a bug? Have a feature request? Or just want to talk about algorithms? Drop us a line and we'll get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-[#0f0f0f] border border-[#27272a] rounded-xl text-[#F2613F] group-hover:bg-[#F2613F]/10 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Email Us</p>
                    <a href="mailto:support@clashofcode.com" className="text-gray-300 hover:text-white transition-colors font-medium">
                      support@clashofcode.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-[#0f0f0f] border border-[#27272a] rounded-xl text-[#F2613F] group-hover:bg-[#F2613F]/10 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Headquarters</p>
                    <p className="text-gray-300 font-medium">
                      IIIT Kota Campus<br />
                      Rajasthan, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-[#27272a] my-8"></div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-4">Follow Us</p>
                <div className="flex items-center gap-3">
                  <a href="#" className="p-3 bg-[#0f0f0f] border border-[#27272a] rounded-xl text-gray-400 hover:text-white hover:border-[#F2613F] hover:bg-[#F2613F]/10 transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-[#0f0f0f] border border-[#27272a] rounded-xl text-gray-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-3 bg-[#0f0f0f] border border-[#27272a] rounded-xl text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F2613F] to-transparent opacity-50"></div>
              
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#F2613F]" /> Send a Message
              </h3>
              <p className="text-gray-500 mb-8 text-sm">Fill out the form to open your default email app.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold ml-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#F2613F] focus:ring-1 focus:ring-[#F2613F] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#F2613F] focus:ring-1 focus:ring-[#F2613F] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold ml-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#F2613F] focus:ring-1 focus:ring-[#F2613F] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold ml-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your issue or feedback in detail..."
                    required
                    rows="5"
                    className="w-full bg-[#0f0f0f] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#F2613F] focus:ring-1 focus:ring-[#F2613F] transition-all resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer sm:text-base transition-all flex items-center justify-center gap-2 mt-4 bg-[#F2613F] hover:bg-[#9B3922] text-white active:scale-[0.98] shadow-[0_0_20px_rgba(242,97,63,0.3)] hover:shadow-[0_0_25px_rgba(242,97,63,0.5)]"
                >
                  Send Message <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #52525b; }
      `}</style>
    </div>
  );
};

export default Contact;