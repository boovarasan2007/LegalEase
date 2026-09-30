export interface LegalDictionaryEntry {
  term: string;
  category: 'General' | 'Contract' | 'Dispute' | 'Liability' | 'Property';
  simpleMeaning: string;
  example: string;
  practicalTip: string;
}

export const LEGAL_DICTIONARY: LegalDictionaryEntry[] = [
  {
    term: 'Indemnity / Indemnification',
    category: 'Liability',
    simpleMeaning: 'A promise by one party to pay for the financial losses, damages, or legal costs incurred by the other party if certain problems arise.',
    example: 'A software company agrees to indemnify a customer if a third party sues the customer claiming the software stole their copyright.',
    practicalTip: 'Always check if the indemnity is mutual or one-sided, and whether there is an overall liability cap limiting how much you can be forced to pay.',
  },
  {
    term: 'Jurisdiction & Governing Law',
    category: 'Dispute',
    simpleMeaning: 'Specifies which state or country\'s legal system applies to interpret the agreement, and which geographic court has the authority to resolve disputes.',
    example: '"This Agreement shall be governed by the laws of the State of Delaware, and any disputes shall be heard in Wilmington, Delaware."',
    practicalTip: 'If the other party is based far away, an inconvenient jurisdiction could force you to hire out-of-state lawyers and travel for hearings.',
  },
  {
    term: 'Liability & Limitation of Liability',
    category: 'Liability',
    simpleMeaning: 'Legal responsibility for damage, loss, or injury caused to another. A limitation clause sets a maximum dollar ceiling on how much damages can be recovered.',
    example: '"In no event shall either party\'s total cumulative liability exceed the total fees paid under this Agreement in the past 12 months."',
    practicalTip: 'Watch out for clauses where one party has unlimited liability while the other party\'s liability is capped at a few hundred dollars.',
  },
  {
    term: 'Arbitration',
    category: 'Dispute',
    simpleMeaning: 'A private way of resolving legal disputes outside of the public court system, where an independent arbitrator makes a binding decision instead of a judge and jury.',
    example: 'Instead of going to a public courthouse, both parties submit their evidence to an American Arbitration Association (AAA) arbitrator in private.',
    practicalTip: 'Mandatory arbitration often waives your right to a jury trial and class-action participation. Arbitration costs can also be high.',
  },
  {
    term: 'Confidentiality',
    category: 'Contract',
    simpleMeaning: 'An obligation prohibiting parties from sharing secret business, technical, or financial information with outsiders.',
    example: 'You cannot disclose the client\'s customer list, proprietary source code, or pricing tiers to any competitor.',
    practicalTip: 'Ensure standard exceptions exist (such as information that was already public or ordered to be disclosed by a court subpoena).',
  },
  {
    term: 'Breach of Contract',
    category: 'Contract',
    simpleMeaning: 'Failure to perform any promise, duty, or obligation stated in the contract without a legally valid excuse.',
    example: 'Failing to pay an invoice within the agreed 30 days or failing to deliver services by the milestone date.',
    practicalTip: 'Contracts usually distinguish between a minor breach and a "material breach" (which allows the innocent party to terminate immediately and seek damages).',
  },
  {
    term: 'Termination for Cause vs. Convenience',
    category: 'Contract',
    simpleMeaning: 'Termination for Cause occurs when someone breaks rules or breaches duties. Termination for Convenience allows cancellation for any reason with prior written notice.',
    example: '"Either party may terminate this Agreement at any time without cause by providing thirty (30) days prior written notice."',
    practicalTip: 'If only one party has the right to terminate for convenience, the other party could be unexpectedly terminated or locked in without reciprocal exit rights.',
  },
  {
    term: 'Consideration',
    category: 'General',
    simpleMeaning: 'The value that each party gives or promises to give the other (money, services, goods, or refraining from an action) that makes an agreement legally binding.',
    example: 'Party A gives $5,000; Party B builds a website. Without consideration, a promise is generally treated as an unenforceable gift.',
    practicalTip: 'A contract without two-way consideration may be challenged as invalid in many jurisdictions.',
  },
  {
    term: 'Force Majeure',
    category: 'Contract',
    simpleMeaning: 'An "act of God" or extreme unexpected event (war, natural disasters, epidemics, government embargoes) that frees parties from liability for failing to perform obligations.',
    example: 'A hurricane wipes out electrical power across the region, preventing a supplier from delivering goods on time without being penalized.',
    practicalTip: 'Check whether economic downturns or normal supply chain delays are excluded; force majeure typically only covers truly unforeseeable events.',
  },
  {
    term: 'Severability',
    category: 'General',
    simpleMeaning: 'A clause stating that if a court finds one paragraph or term invalid, the rest of the agreement remains valid and enforceable.',
    example: 'If a non-compete clause is deemed too strict by a judge, only that clause is removed or revised while the rest of the employment contract stays in effect.',
    practicalTip: 'This is standard boilerplate protecting the overall deal from being completely thrown out over a single defective sentence.',
  },
  {
    term: 'Liquidated Damages',
    category: 'Liability',
    simpleMeaning: 'A predetermined, fixed amount of money that must be paid if a specific breach occurs, agreed upon in advance when actual damages would be difficult to calculate.',
    example: 'A commercial contractor agrees to pay $250 for every day the construction project is delayed past the agreed completion date.',
    practicalTip: 'Courts will invalidate liquidated damages if the amount is unreasonably high and acts as an illegal punitive penalty rather than a reasonable estimate of loss.',
  },
  {
    term: 'Representations and Warranties',
    category: 'Contract',
    simpleMeaning: 'Formal statements of fact ("representations") and promises of quality or truth ("warranties") made by one party to induce the other party to enter the contract.',
    example: 'A seller formally warrants that they own 100% of the software copyright and that the company has no undisclosed tax liens.',
    practicalTip: 'If a warranty turns out to be untrue, the other party can sue for breach and recover resulting damages.',
  },
  {
    term: 'Non-Compete & Non-Solicitation',
    category: 'Contract',
    simpleMeaning: 'A restriction prohibiting a former worker or partner from competing in the same industry or poaching company clients and staff for a set time and geographic area.',
    example: 'An employee agrees not to start a competing cybersecurity consultancy within a 50-mile radius for 12 months after leaving.',
    practicalTip: 'Many states (e.g. California, Minnesota, and recent federal rules) strictly prohibit or heavily restrict non-compete agreements. Check local state enforceability.',
  },
  {
    term: 'Assignment',
    category: 'General',
    simpleMeaning: 'The transfer of contractual rights or obligations to a third party who was not originally part of the agreement.',
    example: 'Company A assigns its right to receive payments to a debt collection agency or acquires another company and transfers the client contracts.',
    practicalTip: 'Check whether the contract allows assignment without your written consent—you might end up doing business with a competitor who bought out the original vendor.',
  },
  {
    term: 'Entire Agreement / Integration Clause',
    category: 'General',
    simpleMeaning: 'A clause stating that this written document represents the final and complete understanding between the parties, superseding all prior oral discussions or emails.',
    example: '"This Agreement contains the entire understanding of the parties and supersedes all prior agreements, oral or written, concerning the subject matter."',
    practicalTip: 'If a salesperson promised you special perks or extra features over a phone call, those promises are legally useless unless written into the contract itself!',
  },
];

export interface SampleContract {
  id: string;
  title: string;
  category: string;
  summary: string;
  filename: string;
  content: string;
}

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'sample-nda',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'Confidentiality',
    summary: 'Standard bilateral non-disclosure agreement for business partnership evaluations, proprietary technology exchange, and trade secret protection.',
    filename: 'Mutual_Non_Disclosure_Agreement.txt',
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of October 15, 2026 (the "Effective Date"), by and between:

PARTIES:
1. Apex Dynamics Inc., a Delaware corporation with its principal office at 100 Innovation Way, Suite 400, San Francisco, CA 94105 ("Apex"); and
2. Horizon Cloud Solutions LLC, an Oregon limited liability company with its principal office at 550 Pine Street, Portland, OR 97204 ("Horizon").
Apex and Horizon are collectively referred to as the "Parties" and individually as a "Party."

1. PURPOSE OF DISCLOSURE
The Parties wish to explore a potential strategic business collaboration regarding cross-platform enterprise cloud integrations (the "Purpose"). In connection with the Purpose, either Party ("Disclosing Party") may disclose to the other Party ("Receiving Party") certain confidential, proprietary, or non-public information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public information disclosed by the Disclosing Party to the Receiving Party, whether oral or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, without limitation: source code, APIs, technical specifications, financial forecasts, customer lists, product roadmaps, pricing models, and business strategies.

3. EXCLUSIONS FROM CONFIDENTIALITY
Confidential Information does not include information that:
(a) is or becomes publicly known through no breach of this Agreement by the Receiving Party;
(b) was already in the rightful possession of the Receiving Party prior to disclosure without confidentiality restrictions;
(c) is independently developed by the Receiving Party without reference to or reliance upon the Disclosing Party's Confidential Information; or
(d) is rightfully obtained by the Receiving Party from a third party authorized to make such disclosure without restriction.

4. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
(a) protect the Disclosing Party's Confidential Information with at least the same degree of care it uses for its own confidential information of like kind, but no less than reasonable care;
(b) use Confidential Information solely to evaluate and pursue the Purpose; and
(c) restrict disclosure of Confidential Information strictly to its employees, officers, legal counsel, and financial advisors who have a need to know and who are bound by written confidentiality duties at least as restrictive as those herein.

5. TERM AND DURATION OF OBLIGATIONS
This Agreement shall commence on the Effective Date and continue for a period of two (2) years, at which time it shall expire unless terminated earlier by either Party upon thirty (30) days prior written notice.
The obligations of confidentiality and non-use with respect to Confidential Information disclosed during the term shall survive termination or expiration for a period of three (3) years from the date of disclosure; provided, however, that trade secrets shall remain confidential for as long as they qualify as trade secrets under applicable law.

6. RETURN OR DESTRUCTION OF MATERIALS
Promptly upon written request of the Disclosing Party or upon termination of this Agreement, the Receiving Party shall return or destroy all physical and electronic copies of the Disclosing Party's Confidential Information, certifying such destruction in writing within fifteen (15) days. Archival automated backups kept in accordance with standard disaster recovery policies may be retained but remain subject to continued confidentiality.

7. NO LICENSE OR WARRANTY
Nothing in this Agreement conveys any intellectual property license, patent right, or ownership interest in the Confidential Information. All Confidential Information is provided "AS IS," without warranty of any kind, express or implied.

8. REMEDIES AND INJUNCTIVE RELIEF
The Parties acknowledge that any breach of this Agreement may cause irreparable harm for which monetary damages alone would be inadequate. Therefore, in the event of a breach or threatened breach, the Disclosing Party shall be entitled to seek injunctive relief in any court of competent jurisdiction without the requirement of posting a bond, in addition to all other legal remedies available.

9. GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement shall be governed by, and construed in accordance with, the laws of the State of California, without regard to its conflict of law principles. Any dispute, controversy, or claim arising out of or relating to this Agreement shall be brought exclusively in the state or federal courts located in San Francisco County, California, and each Party irrevocably consents to such personal jurisdiction.

10. MISCELLANEOUS
This Agreement constitutes the entire agreement between the Parties concerning confidentiality for the Purpose and supersedes all prior understandings. Any modification must be made in writing signed by authorized representatives of both Parties.

IN WITNESS WHEREOF, the Parties have executed this Mutual Non-Disclosure Agreement as of the Effective Date.

Apex Dynamics Inc.
By: Elena Rostova, Chief Technology Officer

Horizon Cloud Solutions LLC
By: Marcus Vance, Managing Director`,
  },
  {
    id: 'sample-lease',
    title: 'Commercial Real Estate Office Lease',
    category: 'Real Estate / Property',
    summary: 'A 3-year commercial property lease outlining base rent, operating expenses, security deposit, maintenance duties, indemnification, and default terms.',
    filename: 'Commercial_Office_Lease_Agreement.txt',
    content: `COMMERCIAL OFFICE LEASE AGREEMENT

THIS LEASE AGREEMENT (the "Lease") is made and entered into this 1st day of November, 2026, by and between:

LANDLORD: Metropolis Commercial Holdings LLC, a Delaware corporation ("Landlord"), having an address at 750 Market Boulevard, Suite 1200, Denver, CO 80202; and
TENANT: Lumina Analytics Inc., a Colorado corporation ("Tenant"), having an address at 1200 Tech Center Drive, Denver, CO 80237.

1. PREMISES
Landlord leases to Tenant, and Tenant leases from Landlord, Suite 350 consisting of approximately 4,200 rentable square feet (the "Premises") located on the third floor of the commercial building located at 800 Skyline Plaza, Denver, CO.

2. LEASE TERM
The term of this Lease shall be thirty-six (36) months, commencing on January 1, 2027 (the "Commencement Date") and ending on December 31, 2029 (the "Expiration Date"), unless sooner terminated pursuant to the terms hereof.

3. BASE RENT AND ANNUAL ESCALATION
Tenant covenants to pay Landlord Base Rent in equal monthly installments due on or before the first (1st) day of each calendar month, as follows:
- Year 1 (Months 1-12): $10,500.00 per month ($126,000.00 annually)
- Year 2 (Months 13-24): $11,025.00 per month ($132,300.00 annually, a 5% increase)
- Year 3 (Months 25-36): $11,576.25 per month ($138,915.00 annually, a 5% increase)

Rent not received by the fifth (5th) calendar day of the month shall incur a late charge equal to five percent (5%) of the overdue installment.

4. SECURITY DEPOSIT
Upon mutual execution of this Lease, Tenant shall deposit with Landlord the sum of $21,000.00 (the "Security Deposit") as security for the faithful performance of all covenants and obligations under this Lease. The Security Deposit shall be returned to Tenant within thirty (30) days following the Expiration Date, less any deductions for damages beyond ordinary wear and tear.

5. OPERATING EXPENSES (TRIPLE NET / PRO RATA SHARE)
Tenant shall pay its proportionate share (calculated at 6.8% of the building's total rentable area) of all annual Operating Expenses, including real estate property taxes, hazard insurance, common area maintenance (CAM), HVAC maintenance, janitorial services, and management fees. Landlord shall estimate these expenses monthly, with an annual reconciliation within ninety (90) days following the end of each calendar year.

6. USE AND ALTERATIONS
The Premises shall be used solely for general commercial office, software development, and executive administrative purposes. Tenant shall not perform any structural alterations, electrical wiring modifications, or interior renovations exceeding $2,500 without Landlord's prior written consent.

7. REPAIRS AND MAINTENANCE
Landlord shall be responsible for exterior walls, structural foundations, roof, common elevators, and central heating and cooling systems. Tenant shall keep the interior of the Premises in good, clean order and repair, including all interior partitions, non-structural doors, lighting fixtures, and plumbing fixtures within the leased suite.

8. INDEMNIFICATION AND INSURANCE
Tenant agrees to indemnify, defend, and hold harmless Landlord and its property managers from and against any and all claims, liabilities, damages, and legal costs arising from Tenant's use of the Premises or any negligence of Tenant's agents, employees, or visitors. Tenant shall maintain Commercial General Liability insurance of at least $2,000,000.00 per occurrence and $4,000,000.00 aggregate, naming Landlord as an additional insured.

9. ASSIGNMENT AND SUBLETTING
Tenant shall not assign, sublease, mortgage, or transfer this Lease or any interest in the Premises without Landlord's prior written consent, which consent shall not be unreasonably withheld or delayed. Any attempted assignment without written consent shall be void and constitute an immediate material default.

10. DEFAULT AND REMEDIES
If Tenant fails to pay any installment of Rent within ten (10) days after written notice, or fails to cure any non-monetary default within thirty (30) days after written notice, Landlord may terminate this Lease, re-enter the Premises, accelerate all remaining unpaid rent through the expiration date as liquidated damages, and pursue all available remedies at law or in equity.

11. GOVERNING LAW
This Lease shall be governed by and construed under the laws of the State of Colorado. Venue for any legal action arising hereunder shall reside in the City and County of Denver.

EXECUTED as of the date first written above:
LANDLORD: Metropolis Commercial Holdings LLC / By: Arthur Sterling, VP Asset Management
TENANT: Lumina Analytics Inc. / By: Claire Zhao, Chief Executive Officer`,
  },
  {
    id: 'sample-saas',
    title: 'Enterprise Software-as-a-Service (SaaS) Agreement',
    category: 'Technology & IP',
    summary: 'Cloud software subscription agreement covering uptime SLAs, data ownership, intellectual property restrictions, payment terms, and limitation of liability.',
    filename: 'Enterprise_SaaS_Service_Agreement.txt',
    content: `ENTERPRISE SOFTWARE-AS-A-SERVICE (SaaS) AGREEMENT

This Enterprise SaaS Agreement (the "Agreement") is dated December 1, 2026, by and between:

PROVIDER: Sentinel Cloud Security Inc., a Delaware corporation ("Sentinel"), located at 400 Cyber Way, Suite 700, Austin, TX 78701; and
CUSTOMER: Pinnacle Financial Group LLC, a New York limited liability company ("Customer"), located at 1221 Avenue of the Americas, New York, NY 10020.

1. SUBSCRIPTION SERVICES AND LICENSE GRANT
Subject to the terms and payment obligations of this Agreement, Sentinel grants Customer a non-exclusive, non-transferable, non-sublicensable right and license to access and use the Sentinel Shield Threat Monitoring Platform (the "Service") during the Subscription Term for up to 500 authorized enterprise users.

2. SERVICE LEVEL AGREEMENT (SLA) & UPTIME
Sentinel commits to maintaining a 99.9% Monthly Uptime Percentage (excluding scheduled maintenance windows between 01:00 AM and 04:00 AM Central Time on Sundays). If uptime falls below 99.9% in any calendar month, Customer shall be entitled to service fee credits:
- 99.0% to 99.89%: 10% monthly fee credit
- 95.0% to 98.99%: 25% monthly fee credit
- Below 95.0%: 50% monthly fee credit and Customer right to terminate without penalty.
Service credits are Customer's sole and exclusive financial remedy for downtime.

3. FEES AND PAYMENT TERMS
Customer shall pay an Annual Platform Fee of $48,000.00, payable in advance on an annual basis within thirty (30) days of receipt of invoice (Net 30). Unpaid fees after thirty (30) days will accrue late interest at the rate of 1.5% per month or the maximum rate permitted by law. Customer is responsible for all applicable sales, use, or value-added taxes.

4. TERM AND AUTOMATIC RENEWAL
The initial term shall be one (1) year commencing January 1, 2027. THIS AGREEMENT SHALL AUTOMATICALLY RENEW FOR SUCCESSIVE ONE-YEAR TERMS UNLESS EITHER PARTY PROVIDES WRITTEN NOTICE OF NON-RENEWAL AT LEAST SIXTY (60) DAYS PRIOR TO THE EXPIRATION OF THE THEN-CURRENT TERM. Sentinel reserves the right to increase annual subscription fees by up to 5% upon renewal with sixty (60) days advance notice.

5. CUSTOMER DATA AND INTELLECTUAL PROPERTY
Customer retains all right, title, and ownership interest in all electronic data or materials submitted by Customer to the Service ("Customer Data"). Sentinel acquires no ownership rights. Sentinel shall implement industry-standard administrative, physical, and technical safeguards compliant with SOC 2 Type II and ISO 27001 standards to prevent unauthorized access or breach.

6. RESTRICTIONS ON USE
Customer shall not: (a) reverse engineer, decompile, or disassemble the Service; (b) license, sell, rent, or lease the Service to third parties; (c) use the Service to build a competitive product; or (d) bypass any security or authentication mechanism.

7. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW:
(A) NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS INTERRUPTION).
(B) EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.

8. INDEMNIFICATION
Sentinel shall defend and indemnify Customer against any third-party claim alleging that the Service infringes a valid patent, copyright, or trademark, provided Customer gives prompt written notice, sole control of defense, and reasonable cooperation.

9. GOVERNING LAW AND ARBITRATION
This Agreement shall be governed by the laws of the State of New York. Any controversy or dispute shall be settled by binding arbitration administered by the American Arbitration Association (AAA) in New York City, New York. Both parties waive the right to trial by jury.

SENTINEL CLOUD SECURITY INC. / By: David Vance, Chief Revenue Officer
PINNACLE FINANCIAL GROUP LLC / By: Sarah Jenkins, Chief Information Officer`,
  },
];
