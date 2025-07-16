import React, { useEffect, useState } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useApi } from './hooks/useApi';
import { API_BASE, API_BASE_URL } from './config';

const COURSE = {
  title: "Net Zero Carbon Strategy for Business",
  description: "A comprehensive course on decarbonisation, carbon accounting, carbon reduction, and sustainability for businesses. Taught by industry experts. Includes video lectures, downloadable resources, and a certificate.",
  price: 10,
  image: require('./Home/Logo.png'),
  id: 'netzero-carbon-course',
};

const BuyCourses = () => {
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(8);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [error, setError] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [city, setCity] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');
  const userPackage = (localStorage.getItem('package') || '').toLowerCase();
  const isEligible = userPackage === 'pro' || userPackage === 'premium';
  const hasCourse = localStorage.getItem('hasCourse') === 'true';
  const [preferredStart, setPreferredStart] = useState('');
  const [preferredEnd, setPreferredEnd] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { get, post } = useApi();
  const [area, setArea] = useState('');

  useEffect(() => {
    // Optionally, fetch from backend if you want to check real purchase status
  }, []);

  // Fetch all courses on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  // Fetch instructors when city or area changes
  useEffect(() => {
    if (city) {
      fetch(`${API_BASE_URL}/api/instructors?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => {
          // First, filter by city and area
          const areaMatches = data.filter(inst =>
            inst.city?.toLowerCase() === city.toLowerCase() &&
            inst.location?.toLowerCase() === area.toLowerCase()
          );
          // If no area matches, show all city matches
          const cityMatches = data.filter(inst =>
            inst.city?.toLowerCase() === city.toLowerCase()
          );
          const filtered = area && areaMatches.length > 0 ? areaMatches : cityMatches;
          setInstructors(filtered);

          // Aggregate unique courses from these instructors
          const courseMap = {};
          filtered.forEach(inst => {
            (inst.subjects || []).forEach(subj => {
              const key = subj.name + '|' + subj.durationWeeks;
              if (!courseMap[key]) {
                courseMap[key] = { name: subj.name, durationWeeks: subj.durationWeeks };
              }
            });
          });
          setCourses(Object.values(courseMap));
        })
        .catch(() => {
          setInstructors([]);
          setCourses([]);
        });
    } else {
      setInstructors([]);
      setCourses([]);
    }
    setSelectedInstructor('');
    setAvailableSlots([]);
    setSelectedSlot(null);
    setSelectedCourse(null);
  }, [city, area, date]);

  // Helper to subtract a booking from a slot
  function subtractBooking(slot, booking) {
    // No overlap
    if (booking.end <= slot.start || booking.start >= slot.end) return [slot];
    // Booking covers the whole slot
    if (booking.start <= slot.start && booking.end >= slot.end) return [];
    // Booking overlaps at the start
    if (booking.start <= slot.start && booking.end < slot.end) return [{ start: booking.end, end: slot.end }];
    // Booking overlaps at the end
    if (booking.start > slot.start && booking.end >= slot.end) return [{ start: slot.start, end: booking.start }];
    // Booking is in the middle
    return [
      { start: slot.start, end: booking.start },
      { start: booking.end, end: slot.end }
    ];
  }

  // Fetch available slots for all instructors in city for selected date and preferred time
  useEffect(() => {
    if (instructors.length && date && preferredStart && preferredEnd && selectedCourse) {
      Promise.all(instructors.map(inst =>
        fetch(`${API_BASE_URL}/api/instructors/profile/${inst.email}`)
          .then(res => res.json())
      )).then(profiles => {
        // Filter instructors who offer the selected course
        const filteredProfiles = profiles.filter(inst =>
          (inst.subjects || []).some(subj =>
            subj.name === selectedCourse.name && String(subj.durationWeeks) === String(selectedCourse.durationWeeks)
          )
        );
        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        let slots = [];
        filteredProfiles.forEach(inst => {
          const avail = inst.availability?.[day] || [];
          const bookings = (inst.bookings || []).filter(b => b.date === date);
          avail.forEach(slot => {
            let free = [{ ...slot }];
            bookings.forEach(bk => {
              free = free.flatMap(s => subtractBooking(s, bk));
            });
            free.forEach(f => {
              // Only show slots that overlap with preferred time
              if (
                f.start && f.end &&
                f.start <= preferredEnd && f.end >= preferredStart
              ) {
                // Clamp slot to preferred time
                const slotStart = f.start < preferredStart ? preferredStart : f.start;
                const slotEnd = f.end > preferredEnd ? preferredEnd : f.end;
                slots.push({ instructor: inst.email, start: slotStart, end: slotEnd, name: `${inst.firstName} ${inst.lastName}`, location: inst.location });
              }
            });
          });
        });
        setAvailableSlots(slots);
      });
    } else {
      setAvailableSlots([]);
    }
  }, [instructors, date, preferredStart, preferredEnd, selectedCourse]);

  const checkAvailability = async () => {
    setChecking(true);
    setError('');
    setTimeout(() => {
      setAvailable(true);
      setChecking(false);
    }, 700);
  };

  const handleBook = async () => {
    if (!selectedSlot || !selectedCourse) return;
    setStripeLoading(true);
    setError('');
    try {
      // Book for N weeks
      const bookings = [];
      const startDate = new Date(date);
      for (let i = 0; i < selectedCourse.durationWeeks; i++) {
        const bookingDate = new Date(startDate);
        bookingDate.setDate(startDate.getDate() + i * 7);
        bookings.push({
          date: bookingDate.toISOString().slice(0, 10),
          start: selectedSlot.start,
          end: selectedSlot.end,
          subject: selectedCourse.name,
          location: city,
          studentCount: people
        });
      }
      // Store booking details in localStorage for use after payment
      localStorage.setItem('pendingBooking', JSON.stringify({
        instructorEmail: selectedSlot.instructor,
        clientEmail: localStorage.getItem('userEmail') || '',
        clientName: localStorage.getItem('userName') || '',
        bookings,
        courseName: selectedCourse.name,
        durationWeeks: selectedCourse.durationWeeks
      }));
      // Create Stripe session
      const price = 10 * people * selectedCourse.durationWeeks; // Example: $10 per person per week
      const res = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: [{ name: selectedCourse.name, price, quantity: 1 }]
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to start checkout.');
        setStripeLoading(false);
      }
    } catch (err) {
      setError('Booking error.');
      setStripeLoading(false);
    }
  };

  const handleCheckout = async () => {
    setStripeLoading(true);
    setError('');
    let price = COURSE.price * people;
    if (userPackage === 'premium') price = price * 0.8;
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cart: [{ name: COURSE.title, price, quantity: 1 }]
        })
      });
      const data = await res.json();
      if (data.url) {
        localStorage.setItem('purchasedPackage', `course:${COURSE.title}`);
        localStorage.setItem('hasCourse', 'true');
        window.location.href = data.url;
      } else {
        setError('Failed to start checkout.');
      }
    } catch (err) {
      setError('Checkout error.');
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ margin:'200px',background: '#fff', minHeight: '100vh', padding: '120px 0 60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 400, background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', margin: '32px 0', padding: 0 }}>
          <div style={{ height: 180, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            <img src={COURSE.image} alt="Course" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: '#ffb400',
              color: '#fff',
              borderRadius: 8,
              padding: '4px 16px',
              fontWeight: 600,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'inline-block',
            }}>Featured</span>
          </div>
          <div style={{ padding: 28 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{COURSE.title}</h2>
            <div style={{ color: '#222', fontSize: 16, marginBottom: 12 }}>{COURSE.description}</div>
            <div style={{ color: '#27ae60', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
              Price: ${COURSE.price} per person {userPackage === 'premium' && <span>(20% off for Premium!)</span>}
            </div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 18 }}>Minimum 8 people per booking.</div>
            {!isEligible && (
              <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: 18, margin: '18px 0' }}>
                You must have a Pro or Premium membership to buy this course.<br />
                <a href="/pricing" style={{ color: '#ff6b57', textDecoration: 'underline' }}>See Membership Plans</a>
              </div>
            )}
            {hasCourse && (
              <div style={{ color: '#27ae60', fontWeight: 600, fontSize: 18, margin: '18px 0' }}>
                You have already purchased this course.<br />
                <a href="/courses" style={{ color: '#ff6b57', textDecoration: 'underline' }}>Go to Courses</a>
              </div>
            )}
            {isEligible && !hasCourse && (
              <>
                <ol style={{ marginBottom: 16, color: '#888', fontSize: 15, paddingLeft: 18 }}>
                  <li>Select number of people (min 8)</li>
                  <li>Pick a date</li>
                  <li>Check availability</li>
                  <li>Proceed to checkout and payment</li>
                </ol>
                <label style={{ display: 'block', marginBottom: 8 }}>Number of people (min 8):</label>
                <input type="number" min={8} value={people} onChange={e => setPeople(Math.max(8, parseInt(e.target.value)||8))} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                <label style={{ display: 'block', marginBottom: 8 }}>Location (City):</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                <label style={{ display: 'block', marginBottom: 8 }}>Area/Location (e.g., Model Town):</label>
                <input type="text" value={area} onChange={e => setArea(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                <label style={{ display: 'block', marginBottom: 8 }}>Pick a date:</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                <label style={{ display: 'block', marginBottom: 8 }}>Preferred Start Time:</label>
                <input type="time" value={preferredStart} onChange={e => setPreferredStart(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                <label style={{ display: 'block', marginBottom: 8 }}>Preferred End Time:</label>
                <input type="time" value={preferredEnd} onChange={e => setPreferredEnd(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
                <label style={{ display: 'block', marginBottom: 8 }}>Select Course:</label>
                <select value={selectedCourse ? selectedCourse.name + '|' + selectedCourse.durationWeeks : ''} onChange={e => {
                  const [name, durationWeeks] = e.target.value.split('|');
                  setSelectedCourse(courses.find(c => c.name === name && String(c.durationWeeks) === durationWeeks));
                }} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
                  <option value="">Select a course</option>
                  {courses.map((course, i) => (
                    <option key={i} value={course.name + '|' + course.durationWeeks}>{course.name} (Duration: {course.durationWeeks || '?'} weeks)</option>
                  ))}
                </select>
                {/* Show available slots if city and date are selected */}
                {availableSlots.length > 0 && (
                  <>
                    <label style={{ display: 'block', marginBottom: 8 }}>Available Time Slots:</label>
                    <select value={selectedSlot ? `${selectedSlot.instructor}|${selectedSlot.start}|${selectedSlot.end}` : ''} onChange={e => {
                      const [instructor, start, end] = e.target.value.split('|');
                      setSelectedSlot({ instructor, start, end });
                    }} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
                      <option value="">Select a slot</option>
                      {availableSlots.map((slot, i) => (
                        <option key={i} value={`${slot.instructor}|${slot.start}|${slot.end}`}>
                          {slot.name} {slot.location ? `(${slot.location})` : ''} - {slot.start} to {slot.end}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <button onClick={checkAvailability} disabled={checking || !date || !city} style={{ width: '100%', background: '#90be55', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, marginBottom: 12 }}>
                  {checking ? 'Checking...' : 'Check Availability'}
                </button>
                {available && selectedSlot && (
                  <>
                    <div style={{ marginBottom: 12, color: '#27ae60' }}>Available!</div>
                    <button onClick={handleBook} disabled={stripeLoading} style={{ width: '100%', background: '#ff6b57', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600 }}>
                      {stripeLoading ? 'Booking...' : `Book Now ($${userPackage === 'premium' ? (COURSE.price*people*0.8).toFixed(2) : (COURSE.price*people).toFixed(2)})`}
                    </button>
                  </>
                )}
                {message && <div style={{ color: 'green', marginTop: 8 }}>{message}</div>}
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default BuyCourses; 