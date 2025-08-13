// TodaysRecords.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FileText, LogOut, Clock, CheckCircle, Calendar } from "lucide-react";
import { getVisitorsByDate, markCheckout } from "../services/api";
import { formatDateTime } from "../utils/dateUtils";

// helpers
const formatDateForInput = (d: Date) => d.toISOString().split("T")[0];
const todayStr = formatDateForInput(new Date());

type RawVisitor = Record<string, any>;
type Visitor = {
  _id: string | number;
  name: string;
  mobile: string;
  address: string;
  purpose: string;
  reference: string;
  checkIn: string | null;
  checkOut: string | null;
};

export default function TodaysRecords(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [rawVisitors, setRawVisitors] = useState<RawVisitor[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch and normalize
  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      setIsLoadingData(true);
      setErrorMsg(null);
      try {
        const data = await getVisitorsByDate(selectedDate);   // should return array or []
        if (!alive) return;
        console.log("API visitors:", data);
        setRawVisitors(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to load visitors:", err);
        setErrorMsg(err?.message ?? "Failed to fetch visitors");
        setRawVisitors([]);
      } finally {
        if (alive) setIsLoadingData(false);
      }
    };
    fetchData();
    return () => { alive = false; };
  }, [selectedDate]);

  // Normalize visitor shape so UI uses consistent fields
  const visitors: Visitor[] = useMemo(() => {
    return rawVisitors.map((v: RawVisitor) => {
      const _id = v._id ?? v.id ?? String(Math.random()).slice(2);
      const name = v.name ?? v.fullName ?? "";
      const mobile = v.mobile ?? v.mobileNumber ?? v.phone ?? "";
      const address = v.address ?? v.addr ?? "";
      const purpose = v.purpose ?? v.reason ?? "";
      const reference = v.reference ?? v.meetingWith ?? v.referenceName ?? "";
      const checkIn = v.checkIn ?? v.checkInTime ?? v.check_in ?? null;
      const checkOut = v.checkOut ?? v.checkOutTime ?? v.check_out ?? null;
      return { _id, name, mobile, address, purpose, reference, checkIn, checkOut };
    });
  }, [rawVisitors]);

  const totals = useMemo(() => {
    const total = visitors.length;
    const active = visitors.filter((v) => !v.checkOut).length;
    const left = visitors.filter((v) => !!v.checkOut).length;
    return { total, active, left };
  }, [visitors]);

  const handleCheckOut = async (id: string | number) => {
    setCheckoutLoadingId(String(id));
    try {
      // Accept either _id or id - backend expects Mongo _id usually
      await markCheckout(String(id));
      // refresh
      const data = await getVisitorsByDate(selectedDate);
      setRawVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("checkout error:", err);
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  const backToToday = () => setSelectedDate(todayStr);

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-700">Visitor Records</h2>
              <p className="text-gray-600 text-sm">
                Showing records for <span className="font-medium">{selectedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1 shadow-sm bg-white">
              <Calendar className="w-4 h-4 text-blue-600 mr-2" />
              <input
                type="date"
                value={selectedDate}
                max={todayStr}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="outline-none"
                aria-label="Select date"
              />
            </div>

            <button
              onClick={backToToday}
              disabled={selectedDate === todayStr}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedDate === todayStr
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Back to Today
            </button>
          </div>
        </div>

        {/* top stats */}
        <div className="flex items-center justify-end gap-6 mb-4">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white">
            <span className="text-2xl font-bold text-white">{totals.total}</span>
            <span className="text-xs text-blue-100 font-semibold">Total</span>
          </div>

          <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white">
            <span className="text-lg font-bold text-white">{totals.active}</span>
            <span className="text-xs text-green-100 font-semibold">Active</span>
          </div>

          <div className="w-24 h-24 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white">
            <span className="text-lg font-bold text-white">{totals.left}</span>
            <span className="text-xs text-gray-100 font-semibold">Left</span>
          </div>
        </div>

        {/* loading / error */}
        {isLoadingData ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-gray-600">Loading visitors...</div>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-50 rounded-2xl shadow p-6 text-center text-red-700">
            {errorMsg}
          </div>
        ) : visitors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Visitors Found</h3>
            <p className="text-gray-600">There are no records for the selected date.</p>
          </div>
        ) : (
          // table
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact & Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {visitors.map((v) => (
                    <tr key={String(v._id)} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-white">{(v.name || " ").charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{v.name}</div>
                            <div className="text-sm text-gray-500">ID: {String(v._id).slice(-8)}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{v.mobile}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate" title={v.address}>
                          {v.address}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{v.purpose}</div>
                        <div className="text-sm text-gray-500">Reference: {v.reference}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-green-500" />
                          {v.checkIn ? formatDateTime(v.checkIn) : "-"}
                        </div>
                        {v.checkOut && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <LogOut className="w-4 h-4 mr-1 text-red-500" />
                            {formatDateTime(v.checkOut)}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {v.checkOut ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Checked Out</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCheckOut(v._id)}
                            disabled={checkoutLoadingId === String(v._id)}
                            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium shadow-md ${
                              checkoutLoadingId === String(v._id)
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                            }`}
                          >
                            <LogOut className="w-4 h-4 mr-1" />
                            {checkoutLoadingId === String(v._id) ? "Checking Out..." : "Check Out"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
