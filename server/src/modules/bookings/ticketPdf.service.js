import PDFDocument from 'pdfkit';

export const buildTicketPdf = (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Colors
      const primaryColor = '#0284c7'; // Sky 600
      const darkColor = '#0f172a'; // Slate 900
      const mutedColor = '#64748b'; // Slate 500
      const successColor = '#059669'; // Emerald 600

      // 1. Header Banner
      doc
        .rect(40, 40, 515, 65)
        .fill(darkColor);

      doc
        .fillColor('#ffffff')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('SkyBook', 55, 52);

      doc
        .fillColor(primaryColor)
        .fontSize(22)
        .text('.', 146, 52);

      doc
        .fillColor('#94a3b8')
        .fontSize(10)
        .font('Helvetica')
        .text('ELECTRONIC FLIGHT TICKET & BOARDING PASS', 55, 78);

      // PNR Badge in Top Right
      doc
        .rect(380, 52, 160, 40)
        .fill(primaryColor);

      doc
        .fillColor('#ffffff')
        .fontSize(9)
        .font('Helvetica')
        .text('BOOKING REFERENCE (PNR)', 390, 58);

      doc
        .fillColor('#ffffff')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(booking.bookingReference, 390, 70);

      // 2. Booking Status & Meta Bar
      doc.moveDown(4);
      const startY = 120;

      doc
        .rect(40, startY, 515, 45)
        .fill('#f1f5f9');

      doc
        .fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('STATUS:', 55, startY + 12);

      doc
        .fillColor(booking.status === 'CONFIRMED' ? successColor : '#d97706')
        .fontSize(11)
        .text(booking.status, 105, startY + 11);

      doc
        .fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('ISSUED TO:', 220, startY + 12);

      doc
        .fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica')
        .text(booking.contactEmail, 285, startY + 12);

      doc
        .fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('TOTAL FARE:', 430, startY + 12);

      doc
        .fillColor(primaryColor)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(`Rs. ${parseFloat(booking.totalAmount).toLocaleString('en-IN')}`, 430, startY + 25);

      // 3. Passenger Details Table
      let currentY = startY + 65;

      doc
        .fillColor(darkColor)
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('PASSENGER INFORMATION', 40, currentY);

      currentY += 20;

      // Table Header
      doc
        .rect(40, currentY, 515, 22)
        .fill('#e2e8f0');

      doc
        .fillColor(darkColor)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('PASSENGER NAME', 50, currentY + 6)
        .text('TYPE', 220, currentY + 6)
        .text('SEAT', 300, currentY + 6)
        .text('PASSPORT', 370, currentY + 6)
        .text('BAGGAGE', 460, currentY + 6);

      currentY += 22;

      booking.passengers.forEach((p, idx) => {
        const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        doc.rect(40, currentY, 515, 24).fill(bg);

        doc
          .fillColor(darkColor)
          .fontSize(9)
          .font('Helvetica')
          .text(`${p.title || ''} ${p.firstName} ${p.lastName}`.trim(), 50, currentY + 7)
          .text(p.type, 220, currentY + 7)
          .text(p.seatNumber || '14A', 300, currentY + 7)
          .text(p.passportNumber ? `•••• ${p.passportNumber.slice(-4)}` : 'Verified', 370, currentY + 7)
          .text(p.baggageAllowance || '1 x 23kg', 460, currentY + 7);

        currentY += 24;
      });

      // 4. Flight Itinerary Segments
      currentY += 25;

      doc
        .fillColor(darkColor)
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('FLIGHT ITINERARY', 40, currentY);

      currentY += 20;

      booking.segments.forEach((seg, sIdx) => {
        // Segment Card Box
        doc
          .rect(40, currentY, 515, 75)
          .lineWidth(1)
          .strokeColor('#cbd5e1')
          .stroke();

        // Carrier & Flight No Header
        doc
          .rect(40, currentY, 515, 22)
          .fill('#f1f5f9');

        doc
          .fillColor(primaryColor)
          .fontSize(9)
          .font('Helvetica-Bold')
          .text(`${seg.carrierName} (${seg.flightNumber})`, 50, currentY + 6);

        doc
          .fillColor(mutedColor)
          .fontSize(8)
          .font('Helvetica')
          .text(`Aircraft: ${seg.aircraft || 'Commercial Jet'} | Cabin: ${seg.cabinClass}`, 340, currentY + 6);

        // Flight Times & Airports
        const depTime = new Date(seg.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const depDate = new Date(seg.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        const arrTime = new Date(seg.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const arrDate = new Date(seg.arrivalTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

        // Origin
        doc
          .fillColor(darkColor)
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(depTime, 50, currentY + 30);

        doc
          .fillColor(primaryColor)
          .fontSize(11)
          .text(seg.originAirport, 50, currentY + 46);

        doc
          .fillColor(mutedColor)
          .fontSize(8)
          .font('Helvetica')
          .text(`${seg.originCity}${seg.originTerminal ? ` (T${seg.originTerminal})` : ''}`, 50, currentY + 59);

        // Arrow / Duration in middle
        doc
          .fillColor(mutedColor)
          .fontSize(8)
          .text(`Duration: ${Math.floor(seg.durationMinutes / 60)}h ${seg.durationMinutes % 60}m`, 240, currentY + 34);

        doc
          .rect(210, currentY + 46, 100, 1)
          .fill('#94a3b8');

        doc
          .fillColor(primaryColor)
          .fontSize(10)
          .text('✈', 255, currentY + 41);

        // Destination
        doc
          .fillColor(darkColor)
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(arrTime, 440, currentY + 30);

        doc
          .fillColor(primaryColor)
          .fontSize(11)
          .text(seg.destinationAirport, 440, currentY + 46);

        doc
          .fillColor(mutedColor)
          .fontSize(8)
          .font('Helvetica')
          .text(`${seg.destinationCity}${seg.destinationTerminal ? ` (T${seg.destinationTerminal})` : ''}`, 440, currentY + 59);

        currentY += 85;
      });

      // 5. Important Aviation Notices & Verification Barcode
      currentY += 10;

      doc
        .rect(40, currentY, 515, 60)
        .fill('#f8fafc');

      doc
        .fillColor(darkColor)
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('IMPORTANT PASSENGER NOTICES:', 50, currentY + 10);

      doc
        .fillColor(mutedColor)
        .fontSize(7.5)
        .font('Helvetica')
        .text('• Please arrive at the airport at least 3 hours prior to departure for international flights.', 50, currentY + 22)
        .text('• Valid government-issued passport required at security check-in and boarding gates.', 50, currentY + 32)
        .text('• Baggage exceeding cabin limits will be transferred to check-in hold subject to standard airline fees.', 50, currentY + 42);

      // Barcode simulation lines
      doc
        .fillColor(darkColor)
        .fontSize(8)
        .font('Courier-Bold')
        .text(`|||||| |||| |||||||||| ||| | ||||| ${booking.bookingReference} ||||||||| ||`, 50, currentY + 58);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
