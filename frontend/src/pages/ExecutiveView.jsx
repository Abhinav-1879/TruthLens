import React, { useRef } from 'react';
import { FiDownload, FiPrinter, FiShield, FiFileText } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExecutiveView = () => {
    const reportRef = useRef(null);

    // Mock data for initial visualization - in real app, this would come from props or context
    const mockReport = {
        date: new Date().toLocaleDateString(),
        riskLevel: "HIGH",
        complianceStatus: "NON-COMPLIANT",
        summary: "The analyzed content contains a significant fabrication regarding a financial acquisition (Twitter/2015). This poses a direct risk of 'False Advertising' and reputational damage if published.",
        keyFindings: [
            { type: "Fabrication", severity: "Critical", detail: "Claim of acquisition in 2015 is factually incorrect." },
            { type: "Speculation", severity: "Medium", detail: "Financial figures ($44B) are attributed to the wrong timeline." }
        ],
        legalRecommendation: "Do not publish in current form. Requires redrafting of Section 2."
    };

    const generatePDF = async () => {
        const element = reportRef.current;
        if (!element) return;

        try {
            // High scale for better quality
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const data = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProperties = pdf.getImageProperties(data);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`truthlens_audit_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error("PDF Generation failed", err);
            alert("Could not generate PDF. Please try again.");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 text-slate-900 font-serif p-8 md:p-12 overflow-y-auto">
            <div className="fixed top-8 right-8 hidden xl:flex flex-col gap-4 print:hidden z-50">
                <button
                    onClick={generatePDF}
                    className="p-4 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-700 transition-all hover:scale-105"
                    title="Download PDF"
                >
                    <FiDownload size={24} />
                </button>
                <button
                    onClick={handlePrint}
                    className="p-4 bg-white text-slate-900 rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-105"
                    title="Print"
                >
                    <FiPrinter size={24} />
                </button>
            </div>

            {/* Paper-like Container */}
            <div ref={reportRef} className="max-w-[210mm] mx-auto bg-white shadow-2xl border border-gray-200 min-h-[297mm] p-12 md:p-16 relative">

                {/* Header */}
                <header className="border-b-4 border-slate-900 pb-8 mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <FiShield size={32} className="text-slate-900" />
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900">TruthLens Audit</h1>
                        </div>
                        <p className="text-slate-500 font-sans text-sm tracking-widest uppercase">Official Compliance Report • Internal Use Only</p>
                    </div>
                    <div className="text-right font-sans">
                        <p className="text-sm text-slate-500">Report ID</p>
                        <p className="font-mono font-bold text-lg">TL-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                </header>

                {/* Executive Summary */}
                <section className="mb-12">
                    <h2 className="text-sm font-bold font-sans uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Executive Summary
                    </h2>
                    <div className="bg-slate-50 border-l-4 border-slate-900 p-6 italic text-lg leading-relaxed text-slate-800 font-medium">
                        "{mockReport.summary}"
                    </div>
                </section>

                {/* Risk Assessment */}
                <section className="mb-12">
                    <h2 className="text-sm font-bold font-sans uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Risk Assessment
                    </h2>
                    <div className="grid grid-cols-2 gap-8 mb-8 p-6 bg-slate-900 text-white rounded-lg">
                        <div>
                            <p className="text-xs font-bold uppercase text-slate-400 mb-1">Overall Risk Level</p>
                            <p className="text-3xl font-bold text-rose-500">{mockReport.riskLevel}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-slate-400 mb-1">Compliance Status</p>
                            <p className="text-3xl font-bold text-white">{mockReport.complianceStatus}</p>
                        </div>
                    </div>
                </section>

                {/* Key Findings Table */}
                <section className="mb-16">
                    <h2 className="text-sm font-bold font-sans uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                        Key Findings
                    </h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="py-3 font-sans text-xs font-bold uppercase text-slate-900">Issue Type</th>
                                <th className="py-3 font-sans text-xs font-bold uppercase text-slate-900">Severity</th>
                                <th className="py-3 font-sans text-xs font-bold uppercase text-slate-900">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="font-sans text-sm">
                            {mockReport.keyFindings.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-100">
                                    <td className="py-4 font-bold text-slate-900">{item.type}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${item.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {item.severity}
                                        </span>
                                    </td>
                                    <td className="py-4 text-slate-600 leading-relaxed">{item.detail}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Final Recommendation */}
                <section>
                    <h2 className="text-sm font-bold font-sans uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                        Legal Recommendation
                    </h2>
                    <p className="text-xl font-medium text-slate-900 leading-relaxed border p-6 rounded-lg bg-yellow-50 border-yellow-200">
                        {mockReport.legalRecommendation}
                    </p>
                    <div className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-center text-slate-400 font-sans text-xs">
                        <p className="flex items-center gap-2"><FiShield /> Generated by TruthLens Intelligence Engine</p>
                        <p>{mockReport.date}</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ExecutiveView;
