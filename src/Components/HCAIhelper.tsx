// import { useState } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Link } from "react-router-dom";
// import "../Styles/HCAIHelper.css";
// import flash from "../assets/flash.png"

// type ChatMessage = {
//   sender: "user" | "ai";
//   text: string;
// };

// type HCAIHelperProps = {
//   evmAddress: string | null;
//   privateKey: string | null;
//   accountId: string | null;
// };

// const HCAIhelper = ({ evmAddress, privateKey, accountId }: HCAIHelperProps) => {
//   const [message, setMessage] = useState<string>("");
//   const [chat, setChat] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [activesend, setactivesend] = useState(false);
//   const API =  import.meta.env.VITE_GEMINI_API_KEY as string;
//   const API_url = atob(API);
//   // Initialize Gemini AI
//   const genAI = new GoogleGenerativeAI(
//      API_url
//   );

//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//   });

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     const userMessage: ChatMessage = { sender: "user", text: message };
//     setChat((prev) => [...prev, userMessage]);
//     setMessage("");
//     setLoading(true);

//     console.log(
//       `script : ${evmAddress}, ${privateKey}, ${accountId}`
//     );

//     try {
//       const result = await model.generateContent(message);
//       const response = await result.response;
//       const text = response.text();

//       setChat((prev) => [...prev, { sender: "ai", text }]);
//     } catch (error) {
//       console.error("Gemini error:", error);
//       setChat((prev) => [
//         ...prev,
//         { sender: "ai", text: "Error getting response." },
//       ]);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="AI_chatbox_wrapper">
//       <Link to="/ConnectWallet">
//         <img
//           width="35"
//           height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="left"
//         />
//       </Link>

//       {/* <h2><strong>Your AI companion is here for you</strong>!</h2> */}

//       <div className="AI_chatbox_container">
//         <div className="AI_chatbox_header">
//           <span>AI Assistant</span>
//           <span className="HCAI_xpbar">xp
//             <img  className="image" src={flash} alt="" />
//           </span>
//         </div>

//         <div className="AI_chatbox_messages">
//           {chat.map((msg, index) => (
//             <div key={index} className={`chat_message ${msg.sender}`}>
//               {msg.text}
//             </div>
//           ))}
//           {loading && <div className="chat_message ai">Thinking...</div>}
//         </div>

//         <div className="AI_chatbox_input">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Ask Gemini..."
//             onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
//               e.key === "Enter" && sendMessage()
//             }
//           />
//           <button
//   onClick={sendMessage}
//   className={activesend ? "active" : ""}
//   onMouseEnter={() => setactivesend(true)}
//   onMouseLeave={() => setactivesend(false)}
// >
//   {activesend ? (
//     <img
//       width="24"
//       height="24"
//       src="https://img.icons8.com/fluency/48/sent.png"
//       alt="sent"
//     />
//   ) : (
//     "Send"
//   )}
// </button>
        
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HCAIhelper;



// import { useState, useEffect } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { Link } from "react-router-dom";
// import "../Styles/HCAIHelper.css";
// import flash from "../assets/flash.png";

// import { getWalletInfo, summarizeMessages } from "../utils/Aitools.ts";

// type ChatMessage = {
//   sender: "user" | "ai";
//   text: string;
// };

// type HCAIHelperProps = {
//   evmAddress: string | null;
//   privateKey: string | null;
//   accountId: string | null;
// };

// const HCAIhelper = ({ evmAddress, accountId }: HCAIHelperProps) => {
//   const [message, setMessage] = useState<string>("");
//   const [chat, setChat] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [activesend, setactivesend] = useState(false);

//   const API = import.meta.env.VITE_GEMINI_API_KEY as string;
//   const API_url = atob(API);

//   const genAI = new GoogleGenerativeAI(API_url);

//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//   });

//   /* ------------------------------
//      Load Chat Memory
//   ------------------------------ */

//   useEffect(() => {
//     const saved = localStorage.getItem("hc_ai_chat");
//     if (saved) setChat(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("hc_ai_chat", JSON.stringify(chat));
//   }, [chat]);

//   /* ------------------------------
//      Intent Detection
//   ------------------------------ */

//   const detectIntent = (msg: string) => {
//     const text = msg.toLowerCase();

//     if (text.includes("wallet") || text.includes("account"))
//       return "wallet_info";

//     if (text.includes("evm address"))
//       return "evm";

//     if (text.includes("summarize chat") || text.includes("summarise chat"))
//       return "summarize_chat";

//     return "ai_chat";
//   };

//   /* ------------------------------
//      System Prompt
//   ------------------------------ */

//   const systemPrompt = `
// You are HashCompanion AI.

// You are a Web3 assistant built on Hedera.

// Your responsibilities:
// - Explain blockchain activity
// - Help users understand their wallet
// - Summarize messages or notes
// - Provide simple Web3 explanations

// User wallet context:
// Account ID: ${accountId}
// EVM Address: ${evmAddress}

// Always explain things simply for beginners.
// `;

//   /* ------------------------------
//      Send Message
//   ------------------------------ */

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     const userMessage: ChatMessage = { sender: "user", text: message };

//     setChat((prev) => [...prev, userMessage]);
//     setMessage("");
//     setLoading(true);

//     const intent = detectIntent(message);

//     try {
//       /* -------- Wallet Info Command -------- */

//       if (intent === "wallet_info") {
//         const info = getWalletInfo(accountId, evmAddress);

//         setChat((prev) => [
//           ...prev,
//           { sender: "ai", text: info },
//         ]);

//         setLoading(false);
//         return;
//       }

//       /* -------- EVM Address -------- */

//       if (intent === "evm") {
//         const response = `Your EVM Address is:\n${evmAddress}`;

//         setChat((prev) => [
//           ...prev,
//           { sender: "ai", text: response },
//         ]);

//         setLoading(false);
//         return;
//       }

//       /* -------- Summarize Chat -------- */

//       if (intent === "summarize_chat") {
//         const summaryInput = summarizeMessages(chat);

//         const result = await model.generateContent(
//           `Summarize this conversation:\n${summaryInput}`
//         );

//         const text = result.response.text();

//         setChat((prev) => [
//           ...prev,
//           { sender: "ai", text },
//         ]);

//         setLoading(false);
//         return;
//       }

//       /* -------- Default AI Chat -------- */

//       const result = await model.generateContent(
//         systemPrompt + "\nUser: " + message
//       );

//       const text = result.response.text();

//       setChat((prev) => [
//         ...prev,
//         { sender: "ai", text },
//       ]);

//     } catch (error) {
//       console.error("Gemini error:", error);

//       setChat((prev) => [
//         ...prev,
//         { sender: "ai", text: "⚠️ Error getting AI response." },
//       ]);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="AI_chatbox_wrapper">
//       <Link to="/ConnectWallet">
//         <img
//           width="35"
//           height="35"
//           src="https://img.icons8.com/nolan/64/left.png"
//           alt="left"
//         />
//       </Link>

//       <div className="AI_chatbox_container">

//         {/* Header */}

//         <div className="AI_chatbox_header">
//           <span>AI Assistant</span>

//           <span className="HCAI_xpbar">
//             xp
//             <img className="image" src={flash} alt="" />
//           </span>
//         </div>

//         {/* Messages */}

//         <div className="AI_chatbox_messages">
//           {chat.map((msg, index) => (
//             <div key={index} className={`chat_message ${msg.sender}`}>
//               {msg.text}
//             </div>
//           ))}

//           {loading && (
//             <div className="chat_message ai">Thinking...</div>
//           )}
//         </div>

//         {/* Input */}

//         <div className="AI_chatbox_input">

//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Ask your AI Web3 Copilot..."
//             onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
//               e.key === "Enter" && sendMessage()
//             }
//           />

//           <button
//             onClick={sendMessage}
//             className={activesend ? "active" : ""}
//             onMouseEnter={() => setactivesend(true)}
//             onMouseLeave={() => setactivesend(false)}
//           >
//             {activesend ? (
//               <img
//                 width="24"
//                 height="24"
//                 src="https://img.icons8.com/fluency/48/sent.png"
//                 alt="sent"
//               />
//             ) : (
//               "Send"
//             )}
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default HCAIhelper;


import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from "react-router-dom";
import "../Styles/HCAIHelper.css";
import flash from "../assets/flash.png";

import {
  getWalletInfo,
  summarizeMessages,
} from "../utils/Aitools";

import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

type HCAIHelperProps = {
  evmAddress: string | null;
  privateKey: string | null;
  accountId: string | null;
};

const HCAIhelper = ({ evmAddress, privateKey, accountId }: HCAIHelperProps) => {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activesend, setactivesend] = useState(false);

  // Initialize Gemini AI
  const API = import.meta.env.VITE_GEMINI_API_KEY as string;
  const API_url = atob(API);
  const genAI = new GoogleGenerativeAI(API_url);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  /* -----------------------------
     Load Chat Memory
  ----------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("hc_ai_chat");
    if (saved) setChat(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("hc_ai_chat", JSON.stringify(chat));
  }, [chat]);

  /* -----------------------------
     Intent Detection
  ----------------------------- */
  const detectIntent = (msg: string) => {
    const text = msg.toLowerCase();

    if (text.includes("send") && text.includes("hbar")) return "send_hbar";
    if (text.includes("wallet") || text.includes("account")) return "wallet_info";
    if (text.includes("evm address")) return "evm";
    if (text.includes("summarize chat") || text.includes("summarise chat")) return "summarize_chat";

    return "ai_chat";
  };

  /* -----------------------------
     Parse Transfer Command
  ----------------------------- */
  const parseTransfer = (msg: string) => {
    const amountMatch = msg.match(/(\d+(\.\d+)?)/);
    const accountMatch = msg.match(/0\.0\.\d+/);

    if (!amountMatch || !accountMatch) return null;

    return {
      amount: parseFloat(amountMatch[0]),
      account: accountMatch[0],
    };
  };

  /* -----------------------------
     Hedera HBAR Transfer
  ----------------------------- */
  const sendHBAR = async (amount: number, receiver: string) => {
    if (!accountId || !privateKey) return "Wallet not connected. ⚠️";

    try {
      const client = Client.forTestnet();
      client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));

      const tx = await new TransferTransaction()
        .addHbarTransfer(accountId, new Hbar(-amount))
        .addHbarTransfer(receiver, new Hbar(amount))
        .execute(client);

      const receipt = await tx.getReceipt(client);
      return `Transaction successful! ✅\nStatus: ${receipt.status}`;
    } catch (error) {
      console.error(error);
      return "Transaction failed. ❌";
    }
  };

  /* -----------------------------
     System Prompt
  ----------------------------- */
  const systemPrompt = `
You are HashCompanion AI.

You are a Web3 assistant built on Hedera.

Responsibilities:
- Explain blockchain activity
- Help users understand their wallet
- Summarize messages or notes
- Provide simple Web3 explanations

User wallet context:
Account ID: ${accountId}
EVM Address: ${evmAddress}

Always explain things simply.
`;

  /* -----------------------------
     Send Message
  ----------------------------- */
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    const intent = detectIntent(message);

    try {
      // ---------------- Wallet Info
      if (intent === "wallet_info") {
        const info = getWalletInfo(accountId, evmAddress);
        setChat((prev) => [...prev, { sender: "ai", text: info }]);
        setLoading(false);
        return;
      }

      // ---------------- EVM Address
      if (intent === "evm") {
        const response = `Your EVM Address is:\n${evmAddress}`;
        setChat((prev) => [...prev, { sender: "ai", text: response }]);
        setLoading(false);
        return;
      }

      // ---------------- Summarize Chat
      if (intent === "summarize_chat") {
        const summaryInput = summarizeMessages(chat);
        const result = await model.generateContent(
          `Summarize this conversation:\n${summaryInput}`
        );
        const text = result.response.text();
        setChat((prev) => [...prev, { sender: "ai", text }]);
        setLoading(false);
        return;
      }

      // ---------------- HBAR Transfer
      if (intent === "send_hbar") {
        const parsed = parseTransfer(message);
        if (!parsed) {
          setChat((prev) => [
            ...prev,
            { sender: "ai", text: "I couldn't understand the transfer request." },
          ]);
          setLoading(false);
          return;
        }
        const response = await sendHBAR(parsed.amount, parsed.account);
        setChat((prev) => [...prev, { sender: "ai", text: response }]);
        setLoading(false);
        return;
      }

      // ---------------- Default AI Chat
      const result = await model.generateContent(systemPrompt + "\nUser: " + message);
      const text = result.response.text();
      setChat((prev) => [...prev, { sender: "ai", text }]);

    } catch (error) {
      console.error("Gemini error:", error);
      setChat((prev) => [
        ...prev,
        { sender: "ai", text: "Error getting AI response. ⚠️" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="AI_chatbox_wrapper">
      <Link to="/ConnectWallet">
        <img
          width="35"
          height="35"
          src="https://img.icons8.com/nolan/64/left.png"
          alt="left"
        />
      </Link>

      <div className="AI_chatbox_container">
        {/* Header */}
        <div className="AI_chatbox_header">
          <span>AI Assistant</span>
          <span className="HCAI_xpbar">
            xp
            <img className="image" src={flash} alt="" />
          </span>
        </div>

        {/* Messages */}
        <div className="AI_chatbox_messages">
          {chat.map((msg, index) => (
            <div key={index} className={`chat_message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="chat_message ai">Thinking...</div>}
        </div>

        {/* Input */}
        <div className="AI_chatbox_input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your AI Web3 Copilot..."
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && sendMessage()
            }
          />
          <button
            onClick={sendMessage}
            className={activesend ? "active" : ""}
            onMouseEnter={() => setactivesend(true)}
            onMouseLeave={() => setactivesend(false)}
          >
            {activesend ? (
              <img
                width="24"
                height="24"
                src="https://img.icons8.com/fluency/48/sent.png"
                alt="sent"
              />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HCAIhelper;