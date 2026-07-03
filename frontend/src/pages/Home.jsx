import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Events from '../components/Events';
import Articles from '../components/Articles';
import Gallery from '../components/Gallery';
import ContactForm from '../components/ContactForm';
import Testimonials from '../components/Testimonials';

export default function Home() {
	return (
		<main>
			<Hero />
			<About />
			<Services />
			<Events />
			<Articles />
			<Gallery />
			<Testimonials />
			<ContactForm />
		</main>
	);
}
