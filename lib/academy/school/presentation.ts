import type {PublicClass} from './contracts';

import type {Scene} from './exploration';
export type {Scene,PracticeTask,PracticeResult,Exploration,ExploreEvent} from './exploration';
export {explore,practiceResult} from './exploration';
/** Public teaching practice only. No private definition or assessment imports. */
export const MONEY_EXPERIENCE = {
 revision:'money-experience.1.0.0',classId:'stage-1-class-1',academicVersion:'money-foundations.1.0.0',
 sections:[
  {
   id:'world',setting:'TONIGHT · YOUR KITCHEN',headline:'You need dinner. Money does not exist.',
   situation:'You have something useful to offer. The food seller needs something too. Choose what you would bring and explore the conversation.',visual:'dinner',
   tasks:[{id:'practice-world-offer',kind:'choice',prompt:'What could you offer for dinner?',
    options:[{id:'eggs',label:'A basket of eggs',why:'The seller already has eggs. Your eggs are useful, but this seller needs help fixing a table.'},{id:'time',label:'An hour of your time',why:'The seller might need help tomorrow, while you need dinner tonight. Timing can make exchange harder.'},{id:'repair',label:'Your furniture repair skill',why:'This seller needs a table repaired, so a direct arrangement could work. A different seller may need something else.'}],
    success:'A useful offer can work when both people agree on what they want and when they want it.',retry:''}],
   revealTitle:'Useful is not the same as easy to exchange.',
   explanation:['You can have eggs, skills or time and still struggle to get dinner. The obstacle is finding someone who wants your offer and has what you need.','An accepted way to pay helps people exchange without arranging a matching swap every time. First notice that problem; then we can name the solution.'],
   takeaway:'Ask both questions: what do I need, and what does the other person want?',demi:'Try changing the food seller’s need. Which offers suddenly become useful?'
  },
  {
   id:'barter',setting:'AT THE SHOE STALL',headline:'Eggs for shoes. One problem.',
   situation:'You have eggs and need shoes. The shoemaker has shoes but wants bread. Both of you have valuable goods.',visual:'barter',
   tasks:[{id:'practice-barter-direct',kind:'choice',prompt:'Can this direct trade work with the wants shown?',answer:'no',
    options:[{id:'yes',label:'Yes · my eggs are valuable'},{id:'no',label:'No · the shoemaker wants bread'}],
    success:'You want the shoes, but the shoemaker wants bread rather than eggs. A direct swap needs both wants to match.',retry:'Value alone is not enough. The shoemaker wants bread, so eggs do not meet the other side of this direct swap.'}],
   revealTitle:'Economists call this a double coincidence of wants.',
   explanation:['For a direct swap, you must want what the other person offers, and that person must want what you offer. Here only one side matches.','This is a model of an exchange problem, not a universal history of money. Credit, gifts, obligations and other non-cash arrangements also exist.'],
   takeaway:'Two useful things do not automatically make a workable swap.',demi:'What could change so this direct swap becomes possible? What extra coordination would a chain of swaps require?'
  },
  {
   id:'bridge',setting:'TWO CUSTOMERS · TWO EXCHANGES',headline:'Your customer does not have to sell your groceries.',
   situation:'A carpenter repairs Customer A’s shelf, receives an accepted payment, then buys vegetables from Store B. Follow the two exchanges.',visual:'bridge',
   tasks:[{id:'practice-bridge-grocer',kind:'choice',prompt:'Why can Store B sell vegetables without needing a shelf repaired?',answer:'reuse',
    options:[{id:'shelf',label:'The store secretly receives the repair'},{id:'reuse',label:'The store can use the accepted payment elsewhere'},{id:'free',label:'Money makes vegetables free to produce'}],
    success:'The store accepts payment it can use again. Who buys the carpenter’s work and who sells the groceries can be different people.',retry:'The vegetables still require production and a payment. The bridge is an accepted payment the store can use with someone else.'}],
   revealTitle:'Money connects separate exchanges.',
   explanation:['Sell your work or goods to one person. Use the accepted payment to buy from another. You do not need one person to satisfy both sides.','Money helps coordinate exchange. It does not replace the real work, food or services that people produce.'],
   takeaway:'Who you sell to can be different from who you buy from.',demi:'Trace the work, payment and groceries separately. Which part acts as the bridge?'
  },
  {
   id:'exchange',setting:'FUNCTION 1 OF 3 · PAY',headline:'The groceries move one way. Payment moves the other.',
   situation:'You buy groceries for $18. Focus on the act of paying, rather than on comparing prices or saving for another day.',visual:'exchange',
   tasks:[{id:'practice-function-pay',kind:'choice',prompt:'What job is money doing in this payment?',answer:'exchange',
    options:[{id:'exchange',label:'Helping complete an exchange'},{id:'measure',label:'Only listing prices for comparison'},{id:'later',label:'Only keeping spending ability for later'}],
    success:'Payment helps transfer groceries from the seller to the buyer. In this action money is a medium of exchange.',retry:'Comparing and keeping funds are other jobs. Here the action is a payment that completes a purchase.'}],
   revealTitle:'Medium of exchange = a way to pay that others accept.',
   explanation:['Money acts between the buyer and seller so that each purchase does not need a direct barter arrangement.','A grocery story can include several functions. Identify the action being asked about: paying emphasizes exchange.'],
   takeaway:'PAY → medium of exchange.',demi:'Ask for a different purchase example. What exactly changes hands?'
  },
  {
   id:'account',setting:'FUNCTION 2 OF 3 · COMPARE',headline:'Different groceries. One measuring language.',
   situation:'Bread is $4. Eggs are $5. Milk is $4. You can compare the prices without expressing each item in loaves, eggs or cartons.',visual:'account',
   tasks:[{id:'practice-function-compare',kind:'choice',prompt:'What makes those prices directly comparable?',answer:'common',
    options:[{id:'size',label:'The packages must be the same size'},{id:'common',label:'All prices use the same dollar measure'},{id:'use',label:'All three goods must be equally useful'}],
    success:'A common dollar measure lets you compare $4 bread, $5 eggs and $4 milk. That measuring job is unit of account.',retry:'The goods can differ in size and usefulness. The shared dollar unit is what lets their monetary prices be compared.'}],
   revealTitle:'Unit of account = a common measure for prices and amounts.',
   explanation:['We use a shared monetary unit to state prices, wages and balances. It makes comparisons and records easier.','Equal prices do not make goods identical, and a monetary price does not describe every kind of value.'],
   takeaway:'MEASURE / COMPARE → unit of account.',demi:'Change the egg price. Ask what became more expensive and what allowed the comparison.'
  },
  {
   id:'store',setting:'FUNCTION 3 OF 3 · LATER',headline:'Friday’s earnings. Tuesday’s spending.',
   situation:'You earn $100 on Friday, keep it, and use part on Tuesday. Think about the gap between earning and spending.',visual:'store',
   tasks:[{id:'practice-function-later',kind:'choice',prompt:'What does keeping the money let you carry into Tuesday?',answer:'ability',
    options:[{id:'ability',label:'Spending ability for a later purpose'},{id:'prices',label:'A guarantee that prices cannot change'},{id:'goods',label:'The exact same goods at a fixed price forever'}],
    success:'You retain spending ability for later. Store of value describes that role, without promising constant purchasing power.',retry:'Keeping the nominal amount does not freeze prices. Store of value carries spending ability forward, while purchasing power can change.'},
    {id:'practice-functions-sort',kind:'matching',prompt:'Three jobs, four actions. Match what money is doing.',
     options:[{id:'exchange',label:'Exchange / pay'},{id:'measure',label:'Measure / compare'},{id:'later',label:'Keep for later'}],
     rows:[{id:'bus',label:'Paying a bus fare',answer:'exchange',why:'Paying the fare uses money to obtain transport: medium of exchange.'},{id:'bread',label:'Comparing bread prices at two shops',answer:'measure',why:'Both prices use a common monetary unit: unit of account.'},{id:'later',label:'Keeping earnings for next week',answer:'later',why:'Spending ability is retained for a later purpose: store of value.'},{id:'repair',label:'Paying for a bicycle repair',answer:'exchange',why:'Payment obtains a service: medium of exchange, just as with a goods purchase.'}],
     success:'The action matters. More than one scenario can show the same function; one longer story can show all three.',retry:'Look at each action: paying, comparing or retaining funds. Repeated categories are allowed.'}],
   revealTitle:'The amount can stay the same while its buying power changes.',
   explanation:['An unchanged $100 balance is a nominal amount. Purchasing power is what that amount can buy. If relevant prices rise, the same amount buys less.','Money can serve as a store of value without perfectly preserving real value. Do not confuse this function with a guarantee of financial safety.'],
   takeaway:'KEEP FOR LATER → store of value. Buying power is not guaranteed.',demi:'Keep the balance at $100 but change the price of a familiar basket. What changed?'
  },
  {
   id:'acceptance',setting:'A NOTE · A NETWORK OF ACCEPTANCE',headline:'Why does this paper work as a payment?',
   situation:'A $100 note is not useful because its raw paper costs $100. Follow the expectations that make an accepted currency usable.',visual:'acceptance',
   tasks:[{id:'practice-acceptance-network',kind:'choice',prompt:'Which explanation connects the note to its monetary function?',answer:'network',
    options:[{id:'material',label:'Its raw material must be equally valuable'},{id:'network',label:'People expect to be able to use it again'},{id:'rare',label:'Any rare paper is automatically money'}],
    success:'Expected accepted use supports its function. Businesses can price goods in it and recipients can use it again within a functioning monetary setting.',retry:'Paper cost and rarity alone do not create widespread acceptance. Consider whether the recipient can use the payment again.'}],
   revealTitle:'Acceptance works through people, businesses and institutions.',
   explanation:['Confidence and accepted use connect today’s payment to tomorrow’s exchange. Pricing, settlement and institutions help support a functioning monetary system.','This is more than paper material or scarcity alone. It is also more than assuming a declaration, by itself, explains every aspect of confidence or monetary value.'],
   takeaway:'Money’s use depends on a functioning setting of acceptance.',demi:'Would an unfamiliar token work at every shop? Ask what the seller would need to trust.'
  },
  {
   id:'digital',setting:'BALANCE ≠ PAYMENT TOOL',headline:'Money can be used without handing over a note.',
   situation:'Cash, a bank balance, a debit card and a digital payment can all appear in everyday payments. They are not four identical things.',visual:'digital',
   tasks:[{id:'practice-payment-forms',kind:'multi',prompt:'Which examples can be involved in using money? Select all that apply.',
    options:[{id:'cash',label:'Physical cash'},{id:'balance',label:'A bank balance'},{id:'debit',label:'A debit payment'},{id:'digital',label:'A digital payment'}],expected:['cash','balance','debit','digital'],
    success:'All can be involved, but their roles differ: cash and balances are not the same as the card or app used to access a payment arrangement.',retry:'Money use is broader than cash. Include the balance and tools/arrangements involved, while keeping their roles distinct.'}],
   revealTitle:'Separate the monetary balance from the way you access it.',
   explanation:['A bank balance can support payments. A debit card or app is a tool or interface to an arrangement, not the monetary balance itself.','Specific systems differ. Borrowing through credit creates an obligation; it is not the same as spending previously saved funds.'],
   takeaway:'Cash is one form. A payment tool is not the balance.',demi:'Describe a payment without naming a brand. Identify the balance, tool and recipient.'
  },
  {
   id:'flow',setting:'FOLLOW THE PAYMENTS',headline:'A wage is someone else’s receipt. What could happen next?',
   situation:'An employer pays a worker. The worker buys food. The food business pays a supplier and staff. Explore the flow one payment at a time.',visual:'flow',
   tasks:[{id:'practice-flow-next',kind:'choice',prompt:'After a business receives a customer payment, what is a plausible next use?',answer:'costs',
    options:[{id:'profit',label:'Every dollar received must be profit'},{id:'costs',label:'Pay suppliers, staff or other costs; retain some funds'},{id:'same',label:'The same physical note must go to one fixed next person'}],
    success:'Receipts can meet several costs or be retained. A flow diagram connects payments, without making every receipt profit or every path inevitable.',retry:'A receipt is not automatically profit. Businesses have costs and choices; electronic payments also need not involve a physical note.'}],
   revealTitle:'Payments connect work, goods, services and accounts.',
   explanation:['Following payments helps us see economic relationships. Different recipients may use funds in different ways or retain them.','This is a simplified model, not a claim that one physical dollar follows a deterministic route. Transfers alone do not explain all production, profit or money creation.'],
   takeaway:'Follow the relationship, not an imaginary guaranteed route for one note.',demi:'Branch the diagram: what else might a recipient do? Which payment corresponds to real work or goods?'
  },
  {
   id:'review',setting:'BRING THE THREE JOBS TOGETHER',headline:'One carpenter. Three different actions.',
   situation:'A carpenter compares grocery prices, pays the grocer and keeps part of the earnings for next week. Do not give the whole story just one label.',visual:'review',
   tasks:[{id:'practice-synthesis-actions',kind:'matching',prompt:'Name the function by the action, not by the person.',
    options:[{id:'exchange',label:'Medium of exchange'},{id:'measure',label:'Unit of account'},{id:'later',label:'Store of value'}],
    rows:[{id:'compare',label:'Comparing the grocery prices',answer:'measure',why:'A common unit makes the amounts comparable: unit of account.'},{id:'pay',label:'Paying the grocer',answer:'exchange',why:'Payment obtains groceries: medium of exchange.'},{id:'keep',label:'Keeping part for next week',answer:'later',why:'Retaining spending ability: store of value, without a fixed-purchasing-power promise.'}],
    success:'All three can appear in one story. Explain the action that supports each label.',retry:'Identify the verb in each action: compare, pay or keep for later.'},
    {id:'practice-synthesis-thought',kind:'reflection',prompt:'In your words: how do those actions do different jobs?',success:'Compare your explanation with the action labels. Does it mention a common measure, accepted payment and spending ability for later?',retry:''}],
   revealTitle:'Explain the relationship. Do not just memorize the label.',
   explanation:['Money helps coordinate exchange, gives a common measure and retains spending ability for later. Its usefulness rests on accepted use and a functioning setting, not the raw material of a note.','Connect this to the carpenter and grocery seller: accepted payment separates their wants. Then distinguish comparing prices, paying and retaining funds by what money is doing.'],
   takeaway:'You can explain the three functions with evidence from the action.',demi:'Ask for a new example and a purchasing-power qualification before moving to the knowledge and reasoning review.'
  }
 ] as Scene[]
};

export function classPresentation(doc:Pick<PublicClass,'id'|'version'|'sections'>) {
 if(doc.id!==MONEY_EXPERIENCE.classId||doc.version!==MONEY_EXPERIENCE.academicVersion||doc.sections.length!==MONEY_EXPERIENCE.sections.length||doc.sections.some((s,i)=>s.id!==MONEY_EXPERIENCE.sections[i].id)) return null;
 return MONEY_EXPERIENCE;
}

const feedback:Record<string,[string,string]>={
 world:['Useful goods and skills still need a willing counterparty. Matching wants is the problem.','Ask what each person has and wants. Useful goods alone do not guarantee a swap.'],
 barter:['Both people must want what the other offers in this direct swap.','Look at the other person’s want, not only at the value of your offer.'],
 bridge:['Accepted payment connects separate exchanges and separates who buys your work from who sells your groceries.','The grocer can use an accepted payment elsewhere; the grocer does not need to want carpentry.'],
 exchange:['Paying for goods or services emphasizes medium of exchange.','Focus on the payment action; comparing and keeping funds emphasize different functions.'],
 account:['A common monetary measure allows comparison: unit of account.','Comparing prices in a common unit is different from paying or saving.'],
 store:['Keeping spending ability for later is store of value; purchasing power can still change.','Separate an unchanged amount from purchasing power. Keeping money does not freeze prices.'],
 acceptance:['Accepted use, confidence and a functioning institutional setting support monetary function.','Raw material cost and scarcity alone do not explain widespread accepted use.'],
 digital:['An account balance and its card/app access tool play different roles; money use extends beyond cash.','Distinguish the balance, payment tool and credit obligation rather than treating them as identical.'],
 flow:['Payments connect work, goods and services; receipts are not automatically profit.','Trace possible payment relationships without assuming one physical note or guaranteed profit.'],
 review:['Use the action to explain exchange, comparison and retaining spending ability.','Identify what money is doing in the action, then qualify purchasing power and acceptance.']
};
export function checkFeedback(sectionId:string,passed:boolean):string {
 return feedback[sectionId]?.[passed?0:1]??(passed?'Explain how the example supports the concept.':'Review the concept and try a fresh explanation.');
}

export function sectionAdvance({busy,completed,done,checksPassed}:{busy:boolean;completed:boolean;done:boolean;checksPassed:boolean}):'navigate'|'save'|'blocked' {
 if(busy)return 'blocked';
 if(completed||done)return 'navigate';
 return checksPassed?'save':'blocked';
}
