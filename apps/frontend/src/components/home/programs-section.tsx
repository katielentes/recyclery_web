import { H2, Section } from '../generic/styled-tags.tsx';
import Program from './program.tsx';

export default function ProgramsSection() {
  return (
    <Section>
      <H2>our programs</H2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Program title={'open shop'} learnMoreLink={'/our-programs/openshop'}>
            Come work on your own bikes using our tools with the help of volunteer mechanics.
            {/* <br />
          <br />
          For femme, trans, women and non-binary community,{' '}
          <A to="/our-programs/ftwnb">FTWN-B Shop Time</A> (Sundays 3-6pm) is another opportunity to
          work on your bike. */}
            <br />
            <br />
            <u>HOURS:</u>
            <br />
            Mondays 5-7pm
            <br />
            Thursdays 7-9pm
            <br />
            Saturdays 11am-2pm
          </Program>
          <Program title={'ftwn-b open shop'} learnMoreLink={'/our-programs/ftwnb'}>
            This program is specifically catering to the Femme, Trans, Women, and Non-Binary members
            of our community.
            <br />
            <br />
            <u>HOURS:</u>
            <br />
            Sundays 3-6pm
          </Program>
        </div>
        <Program
          title={'volunteer at the recyclery'}
          learnMoreLink={'/support-us/donate-time'}
          buttonText={'Learn More & Start Volunteering'}
        >
          Recyclery volunteers actively rescue bikes from the landfill by transforming them into
          sustainable transportation for those in need through our Freecyclery program and beyond!
          Volunteers learn to repair bikes for donation, sell bikes to the community, assist with
          repairs at Open Shop, and so much more!
          <br />
          <br />
          All levels of mechanical experience are welcome.
          <br />
          <br />
          <u>HOURS:</u>
          <br />
          Mondays 12-3pm
          <br />
          Wednesdays 6-8pm
          <br />
          Thursdays 10am-1pm
          <br />
          Sundays 1pm-3pm
        </Program>
        <Program title={'freecyclery program'} learnMoreLink={'/our-programs/freecyclery'}>
          <div className="text-xl">
            Free repaired bike given away to the community (through our referral and fellowship
            programs.)
          </div>
          <br />
          Donated bikes are repaired by volunteer mechanics and donated to those in need in our
          community through our partner organizations.
          <br />
          <br />
          <u>HOURS:</u>
          <br />
          Mondays 12-3pm
          <br />
          Wednesdays 6-8pm
          <br />
          Thursdays 10am-1pm
          <br />
          Sundays 1pm-3pm
        </Program>
        <Program title={'classes'} learnMoreLink={'/our-programs/classes'}>
          We offer Bike Maintenance 1 and 2 classes in our shop space at the Recyclery as well as
          one session special classes like Fix A Flat, Wheel Truing and Winterizing Your Bike!
          <br />
          <br />
          The Recyclery also facilitates off site sessions to fit your organizations needs. We have
          taught Learn to Ride Classers, Intro to City Cycling, and Bike Maintenance 101 for outside
          partners like Chicago Public Library, The City of Evanston, and Youth Opportunity United.
        </Program>
      </div>
    </Section>
  );
}
