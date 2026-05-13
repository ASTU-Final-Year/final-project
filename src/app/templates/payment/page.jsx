"use client";

import { useState } from "react";
import { CreditCard, Smartphone, ShieldCheck, Plus, Trash2, Edit2, Star, Lock, ChevronRight, FileText } from "lucide-react";

export default function PaymentsPage() {
  const [cards, setCards] = useState([
    { id: 1, last4: "4242", holder: "SARAH JOHNSON", expiry: "12/28", isDefault: true, brand: "Visa" },
    { id: 2, last4: "5555", holder: "SARAH JOHNSON", expiry: "09/27", isDefault: false, brand: "Mastercard" },
  ]);
  const [mobileNumber, setMobileNumber] = useState("+251912345678");
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [tempMobile, setTempMobile] = useState(mobileNumber);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ last4: "", holder: "", expiry: "", brand: "Visa" });

  const transactions = [
    { date: "Apr 23, 2026", description: "General Checkup", amount: "500 ETB", status: "PAID" },
    { date: "Apr 10, 2026", description: "Oil Change", amount: "350 ETB", status: "PAID" },
    { date: "Apr 05, 2026", description: "Dental Checkup", amount: "600 ETB", status: "PAID" },
    { date: "Mar 28, 2026", description: "Lab Test", amount: "800 ETB", status: "PAID" },
  ];

  const setDefaultCard = (id) => setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
  const removeCard = (id) => setCards(cards.filter(c => c.id !== id));
  const editCard = (id) => alert(`Edit card ending with ${cards.find(c => c.id === id)?.last4} – feature coming soon.`);
  const addNewCard = () => {
    if (!newCard.last4 || !newCard.holder || !newCard.expiry) { alert("Fill all fields"); return; }
    setCards([...cards, { id: Date.now(), ...newCard, holder: newCard.holder.toUpperCase(), isDefault: false }]);
    setShowAddCard(false); setNewCard({ last4: "", holder: "", expiry: "", brand: "Visa" });
  };
  const saveMobile = () => { setMobileNumber(tempMobile); setIsEditingMobile(false); };
  const handleViewInvoices = () => alert("Redirect to invoices page – coming soon.");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Payment Methods</h1>
          <p className="text-gray-500 mt-1">Manage your saved payment methods for faster checkout and review your billing history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">Add New Payment Method</h2>
                <button onClick={() => setShowAddCard(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Plus size={18} /> Add Card
                </button>
              </div>
              <p className="text-gray-500 text-sm">Securely add credit cards or digital wallets.</p>
            </div>

            {/* Saved Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Cards</h2>
              <div className="space-y-4">
                {cards.map(card => (
                  <div key={card.id} className="flex flex-col sm:flex-row justify-between p-4 border rounded-xl hover:shadow-md">
                    <div className="flex gap-4">
                      <CreditCard className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">•••• {card.last4}</span>
                          {card.isDefault && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">DEFAULT</span>}
                        </div>
                        <div className="text-sm text-gray-500">{card.holder}</div>
                        <div className="text-xs text-gray-400">Expires {card.expiry}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-3 sm:mt-0">
                      <button onClick={() => editCard(card.id)}><Edit2 size={18} className="text-gray-500 hover:text-blue-600" /></button>
                      {!card.isDefault && <button onClick={() => setDefaultCard(card.id)}><Star size={18} className="text-gray-500 hover:text-yellow-500" /></button>}
                      <button onClick={() => removeCard(card.id)}><Trash2 size={18} className="text-gray-500 hover:text-red-600" /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Billing Information */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Billing Information</p>
                    <p className="font-medium">•••• {cards[1]?.last4 || "5555"}</p>
                    <p className="text-xs text-gray-400">Expires {cards[1]?.expiry || "09/27"}</p>
                  </div>
                  <button onClick={() => setDefaultCard(cards[1]?.id)} className="text-blue-600 text-sm hover:underline">Set as Default</button>
                </div>
              </div>
            </div>

            {/* Mobile Money */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-3">Mobile Money</h2>
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-purple-600" />
                {isEditingMobile ? (
                  <div className="flex gap-2">
                    <input value={tempMobile} onChange={e => setTempMobile(e.target.value)} className="border rounded px-2 py-1" />
                    <button onClick={saveMobile} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Save</button>
                    <button onClick={() => setIsEditingMobile(false)} className="text-gray-500">Cancel</button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium">Telebir Account</p>
                      <p className="text-sm text-gray-600">{mobileNumber}</p>
                    </div>
                    <button onClick={() => setIsEditingMobile(true)} className="text-blue-600 text-sm">Edit</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-2"><ShieldCheck className="text-green-600" /><h2 className="font-semibold">Bank-level Security</h2></div>
              <p className="text-sm text-gray-600">All your payment data is encrypted with AES-256 standards. We never store your full card numbers.</p>
              <button className="mt-3 text-blue-600 text-sm flex items-center gap-1">Learn more <ChevronRight size={14} /></button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-3">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 border-b">
                    <tr><th className="text-left py-2">Date</th><th className="text-left py-2">Description</th><th className="text-left py-2">Amount</th><th className="text-left py-2">Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">{tx.date}</td><td>{tx.description}</td><td>{tx.amount}</td>
                        <td><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{tx.status}</span></td>
                        <td><Lock size={16} className="text-gray-400" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={handleViewInvoices} className="mt-4 text-blue-600 text-sm flex items-center gap-1">View All Invoices → <FileText size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Card</h2>
            <div className="space-y-3">
              <input placeholder="Last 4 digits" maxLength="4" value={newCard.last4} onChange={e => setNewCard({...newCard, last4: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Cardholder Name" value={newCard.holder} onChange={e => setNewCard({...newCard, holder: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Expiry (MM/YY)" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} className="w-full border rounded p-2" />
              <select value={newCard.brand} onChange={e => setNewCard({...newCard, brand: e.target.value})} className="w-full border rounded p-2"><option>Visa</option><option>Mastercard</option></select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddCard(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={addNewCard} className="px-4 py-2 bg-blue-600 text-white rounded">Add Card</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}