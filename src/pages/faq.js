// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// Components
import Helmet from 'react-helmet'

const FaqPage = ({ data }) => (
  <div>
    <Helmet title={`FAQ | ${data.site.siteMetadata.title}`}/>
    <h1>Frequently Asked Questions</h1>
    <section>
      <h2>General</h2>
      <ul>
        <li>
          <h3>What is the purpose of this website?</h3>
          <p>We aim to provide a centralized base of Theorycrafting and SimulationCraft results for all World of
            Warcraft classes.<br/>Our goal is to make all the information you need to optimize your character
            accessible on a clear and simple website.
          </p>
        </li>
        <li>
          <h3>Who is it intended for?</h3>
          <p>Everyone who wants to learn more about the optimization and possibilities of their characters. With the
            results we want to give an overview how different builds compare in different situations, what you can do
            to improve your gear and what options may be interesting to you.</p>
        </li>
        <li>
          <h3>How are these results generated?</h3>
          <p>These results are generated using the <a href="http://www.simulationcraft.org/"
            title="SimulationCraft Website">SimulationCraft</a> software, our <a
            href="https://github.com/Ravenholdt-TC/SimcScripts" title="Ruby scripts we use to generate datas">Ruby
            scripts</a>, and several simulation profiles to obtain an overview on multiple aspects of a specialization.
          </p>
        </li>
        <li>
          <h3>Where can I find the SimC profiles that are used for the website?</h3>
          <p>We are almost always using SimulationCraft default profiles with our scripts changing things as necessary
            for each setup. If you are interested in the details behind the scenes, you can check out our base
            profiles<a href="https://github.com/Ravenholdt-TC/SimcScripts/tree/master/profiles"
              title="Profiles used to generate datas">here</a>.
          </p>
        </li>
      </ul>
    </section>
    <section>
      <h2>Combinations</h2>
      <ul>
        <li>
          <h3>How do the combination filters work?</h3>
          <p>For the talent filter you can specify a template for the talent string with the numbers 1-3 for the
            left/middle/right talent of each tier and an x (or *) as a wildcard. For example, entering "xx1xx3x" will
            show only setups with the first talent in the third row and the third talent in the sixth row.<br/>The set
            and legendary filters allow you to select only what you have available to exclude results you are not
            interested in.</p>
        </li>
        <li>
          <h3>What Raid difficulty are the combinations based on?</h3>
          <p>If not specified otherwise, our profiles use unforged Mythic Raid gear. Heroic profiles are marked as
            such.</p>
        </li>
        <li>
          <h3>How can I see the gear of a specific combination simulation?</h3>
          <p>It's not possible to see the details yet but we are working on it!</p>
        </li>
        <li>
          <h3>What T2 traits of the Netherlight Crucible do the Crucible ring simulations use?</h3>
          <p>The profiles of each specialization always use three of what we know to be the best possible tier two
            trait for it. This means that the Crucible ring will likely have the best impact and if you have different
            tier two traits, you should run a simulation for your own character.</p>
        </li>
        <li>
          <h3>Can I compare my character to the combinations?</h3>
          <p>Your character has different gear than the Combinator profile (Mythic+, Warforged / Titanforged, etc. can
            lead to very noticeable differences). We usually only simulate unforged gear for each Tier and difficulty.
            It's highly advisable to sim your own character in order to find the best possible setup.</p>
        </li>
        <li>
          <h3>But if I have to sim my character anyway, what are the combinations for?</h3>
          <p>The main goal of combination sims is to find and highlight outliers and also to get a general idea
            promising setups. Based on the combinations, you can narrow down what builds you would like to investigate
            for your own character. Even if the combinations use different gear than you, the best combination usually
            gets you on the right track!</p>
        </li>
        <li>
          <h3>Do the combinations represent actual raid conditions?</h3>
          <p>
            Not really, at this moment. If not specified otherwise, we usually have single target patchwerk
            simulations without other players or mechanics.<br/>
            Also, the 100%-90% phase as well as the execute phase of the boss might be shorter or longer in a
            simulation, making some legendaries like Cinidaria or talents that work well at certain HP thresholds
            valued differently.<br/>
            There is no ideal solution to this. It depends highly on your group.</p>
        </li>
      </ul>
    </section>
    <section>
      <h2>Relics</h2>
      <ul>
        <li>
          <h3>How to read the relics graph?</h3>
          <p>If you compare a trait to the weapon item level on the first line, you can see how many item levels the
            trait is worth. By hovering over it, you can check out the exact DPS increase.</p>
        </li>
      </ul>
    </section>
    <section>
      <h2>Trinkets</h2>
      <ul>
        <li>
          <h3>How are the trinket simulations generated?</h3>
          <p>Only one trinket is simulated at multiple item levels for the given base profile. Hence, the impact of
            two strong trinkets working very well together may not be taken into account. We want to add an option for
            that in the future.</p>
        </li>
        <li>
          <h3>Is empowerment mechanic for the Pantheon trinkets included?</h3>
          <p>If a Pantheon trinket has a "X-Pantheon" suffix, it means that the simulation assumed X other players
            with the trinket in your raid. Without that suffix, only the baseline proc has been considered.</p>
        </li>
      </ul>
    </section>
  </div>
)

FaqPage.propTypes = {
  data: PropTypes.object
}

export default FaqPage

export const query = graphql`
  query FaqPage {
    site {
      siteMetadata {
        title
      }
    }
  }
`
