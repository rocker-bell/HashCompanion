import { useState} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from "react-router-dom";
import "../Styles/HCAIHelper.css";
import flash from "../assets/flash.png";

import { ethers } from "ethers";
import { toast } from "react-toastify";

import {
  Client,
  AccountId,
  PrivateKey,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  TransferTransaction,
} from "@hashgraph/sdk";

import {
  getWalletInfo,
  summarizeMessages,
} from "../utils/Aitools";

const CONTRACT_ID = "0.0.7059508"; // your deployed contract

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

type Message = {
  timestamp: string;
  sender?: string;
  recipient?: string;
  content: string;
};

// type HCAIHelperProps = {
//   evmAddress: string | null;
//   privateKey: string | null;
//   accountId: string | null;
  
// };

type HCCompanionProps = {
  evmAddress: string | null;
  privateKey: string | null;
  accountId: string | null;
  accounts: { accountId: string; privateKey: string; evmAddress?: string }[];
  activeAccount: number | null;
  setActiveAccount: React.Dispatch<React.SetStateAction<number | null>>;
  connectAccount: (acc?: { accountId: string; privateKey: string }) => Promise<void>;
};

const HCCompanion = ({
  evmAddress,
  privateKey,
  accountId,
  accounts,
  activeAccount,
  connectAccount
}: HCCompanionProps) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activesend, setactivesend] = useState(false);

  const [hcSentMessages, setHcSentMessages] = useState<Message[]>([]);
  const [hcReceivedMessages, setHcReceivedMessages] = useState<Message[]>([]);

  const [isActivefetchmsgs , setisActivefetchmsgs] = useState<Boolean>(false)

  // -----------------------------
  // Initialize Gemini AI
  // -----------------------------
  const API = import.meta.env.VITE_GEMINI_API_KEY as string;
  const API_url = atob(API);
  const genAI = new GoogleGenerativeAI(API_url);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // -----------------------------
  // Hedera Client
  // -----------------------------
  const createClient = () => {
    if (!accountId || !privateKey) throw new Error("Wallet not connected");
    const client =
      import.meta.env.VITE_NETWORK === "mainnet"
        ? Client.forMainnet()
        : Client.forTestnet();
    client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
    client.setMaxQueryPayment(new Hbar(5));
    return client;
  };

  // -----------------------------
  // Decode Hedera Messages
  // -----------------------------
  const decodeMessages = (result: any): Message[] => {
    try {
      const bytes = result.bytes;
      const abi = [
        "function getMessages() view returns ((uint256 timestamp,address sender,address recipient,string content)[])"
      ];
      const iface = new ethers.Interface(abi);
      const decoded = iface.decodeFunctionResult("getMessages", bytes);
      return decoded[0].map((m: any) => ({
        timestamp: new Date(Number(m.timestamp) * 1000).toLocaleString(),
        sender: m.sender,
        recipient: m.recipient,
        content: m.content
      }));
    } catch (err) {
      console.error("Decode error:", err);
      return [];
    }
  };

  // -----------------------------
  // Fetch Messages (on-demand)
  // -----------------------------
  const fetchHcMessages = async (type: "sent" | "received") => {
    if (!accountId || !privateKey || !evmAddress) {
      toast.error("Wallet not connected");
      return;
    }
    try {
      const client = createClient();
      const funcName = type === "sent" ? "getSentMessages" : "getReceivedMessages";
      const query = await new ContractCallQuery()
        .setContractId(CONTRACT_ID)
        .setGas(1_000_000)
        .setFunction(funcName, new ContractFunctionParameters().addAddress(evmAddress))
        .execute(client);

      const decoded = decodeMessages(query);
      if (type === "sent") setHcSentMessages(decoded);
      else setHcReceivedMessages(decoded);

      setisActivefetchmsgs(true)

      toast.success(`${type === "sent" ? "Sent" : "Received"} messages fetched! ✅`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch messages ❌");
    }
  };

  // -----------------------------
  // Send Hedera Chat Message
  // -----------------------------
  const sendHcMessage = async (recipientAddr: string, msg: string) => {
    if (!accountId || !privateKey) {
      toast.error("Wallet not connected");
      return;
    }
    try {
      const client = createClient();
      const tx = await new ContractExecuteTransaction()
        .setContractId(CONTRACT_ID)
        .setGas(500_000)
        .setFunction(
          "sendMessage",
          new ContractFunctionParameters().addAddress(recipientAddr).addString(msg)
        )
        .execute(client);

      await tx.getReceipt(client);
      toast.success("Message sent via Hedera! ✅");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message ❌");
    }
  };

  // -----------------------------
  // HBAR Transfer (Fixed)
  // -----------------------------
  const sendHBAR = async (amount: number, receiver: string) => {
    if (!accountId || !privateKey) return "Wallet not connected. ⚠️";
    try {
      const client =
        import.meta.env.VITE_NETWORK === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();
      client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));
      client.setMaxQueryPayment(new Hbar(5));

      const tx = await new TransferTransaction()
        .addHbarTransfer(accountId, new Hbar(-amount))
        .addHbarTransfer(receiver, new Hbar(amount))
        .execute(client);

      const receipt = await tx.getReceipt(client);
      return `Transaction successful! ✅\nStatus: ${receipt.status}`;
    } catch (error) {
      console.error("HBAR transfer error:", error);
      return "Transaction failed. ❌";
    }
  };

  // -----------------------------
  // AI Intent Parsing (natural commands)
  // -----------------------------
  const detectIntent = (msg: string) => {
    const text = msg.toLowerCase();
    if (text.startsWith("send to ")) return "send_hc_message";
    if (text === "fetch sent") return "fetch_sent";
    if (text === "fetch received") return "fetch_received";
    if (text.includes("send") && text.includes("hbar")) return "send_hbar";
    if (text.includes("wallet") || text.includes("account")) return "wallet_info";
    if (text.includes("evm address")) return "evm";
    if (text.includes("summarize chat") || text.includes("summarise chat")) return "summarize_chat";
    return "ai_chat";
  };

  const parseTransfer = (msg: string) => {
    const amountMatch = msg.match(/(\d+(\.\d+)?)/);
    const accountMatch = msg.match(/0\.0\.\d+/); // Hedera account
    if (!amountMatch || !accountMatch) return null;
    return { amount: parseFloat(amountMatch[0]), account: accountMatch[0] };
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMessage: ChatMessage = { sender: "user", text: message };
    setChat(prev => [...prev, userMessage]);
    setLoading(true);

    const intent = detectIntent(message);

    try {
      if (intent === "send_hc_message") {
        const match = message.match(/^send to (0x[a-fA-F0-9]{40}) (.+)$/i);
        if (!match) {
          setChat(prev => [...prev, { sender: "ai", text: "Invalid format. Use: send to 0xRecipient Your message" }]);
        } else {
          await sendHcMessage(match[1], match[2].trim());
          setChat(prev => [...prev, { sender: "ai", text: "Message sent via Hedera! ✅" }]);
        }
      } else if (intent === "fetch_sent") {
        await fetchHcMessages("sent");
        setChat(prev => [...prev, { sender: "ai", text: "Sent messages fetched! ✅" }]);
      } else if (intent === "fetch_received") {
        await fetchHcMessages("received");
        setChat(prev => [...prev, { sender: "ai", text: "Received messages fetched! ✅" }]);
      } else if (intent === "send_hbar") {
        const parsed = parseTransfer(message);
        if (!parsed) {
          setChat(prev => [...prev, { sender: "ai", text: "Invalid HBAR transfer format" }]);
        } else {
          const response = await sendHBAR(parsed.amount, parsed.account);
          setChat(prev => [...prev, { sender: "ai", text: response }]);
        }
      } else if (intent === "wallet_info") {
        const info = getWalletInfo(accountId, evmAddress);
        setChat(prev => [...prev, { sender: "ai", text: info }]);
      } else if (intent === "evm") {
        setChat(prev => [...prev, { sender: "ai", text: `Your EVM Address is:\n${evmAddress}` }]);
      } else if (intent === "summarize_chat") {
        const summaryInput = summarizeMessages(chat);
        const result = await model.generateContent(`Summarize this conversation:\n${summaryInput}`);
        setChat(prev => [...prev, { sender: "ai", text: result.response.text() }]);
      } else {
        const result = await model.generateContent("User: " + message);
        setChat(prev => [...prev, { sender: "ai", text: result.response.text() }]);
      }
    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { sender: "ai", text: "Error processing request ⚠️" }]);
    }

    setLoading(false);
  };

  const discardMessages = () => {
    setHcSentMessages([]);
    setHcReceivedMessages([]);
    setisActivefetchmsgs(false)
  };

  return (
    <div className="AI_chatbox_wrapper">
      {/* <Link to="/ConnectWallet">
        <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
      </Link> */}

      <Link
  to="/ConnectWallet"
  onClick={() => activeAccount !== null && connectAccount(accounts[activeAccount])}
>
  <img width="35" height="35" src="https://img.icons8.com/nolan/64/left.png" alt="left" />
</Link>

      <div className="AI_chatbox_container">
        <div className="AI_chatbox_header">
          <span>HC Companion AI</span>
          <span className="HCAI_xpbar">
            xp
            <img className="image" src={flash} alt="" />
          </span>
        </div>

        <div className="AI_chatbox_messages">
          {chat.map((msg, idx) => (
            <div key={idx} className={`chat_message ${msg.sender}`}>{msg.text}</div>
          ))}
          {loading && <div className="chat_message ai">Thinking...</div>}
        </div>

        <div className="AI_chatbox_input">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Ask AI, send/fetch HC message, or HBAR transfer..."
            onKeyDown={e => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className={activesend ? "active" : ""}
            onMouseEnter={() => setactivesend(true)}
            onMouseLeave={() => setactivesend(false)}
          >
            {activesend ? (
              <img width="24" height="24" src="https://img.icons8.com/fluency/48/sent.png" alt="sent" />
            ) : "Send"}
          </button>
        </div>

        <div className={`message-container ${isActivefetchmsgs ? "activeFetch" : ""}`}>
          <div className="btn-wrapper">
          <button className="discard-btn" onClick={discardMessages}>X</button>
          </div>
          <h3 className="msg-header">Received Hedera Messages</h3>
          {hcReceivedMessages.map((msg, idx) => (
            <div key={idx} className="message-card received-message">
              <b>{msg.sender}</b>
              <p>{msg.content}</p>
              <small>{msg.timestamp}</small>
            </div>
          ))}

          <h3 className="msg-header">Sent Hedera Messages</h3>
          {hcSentMessages.map((msg, idx) => (
            <div key={idx} className="message-card sent-message">
              <b>To: {msg.recipient}</b>
              <p>{msg.content}</p>
              <small>{msg.timestamp}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HCCompanion;