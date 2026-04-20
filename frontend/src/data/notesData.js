const notesData = {
  CS: [
    {
      id: 'cs1',
      title: 'ACID Properties',
      subject: 'DBMS',
      icon: '🗄️',
      readTime: '5 min',
      topics: 4,
      content: [
        {
          heading: 'What are ACID Properties?',
          type: 'text',
          text: 'ACID properties ensure reliable processing of database transactions. Every transaction must follow these 4 properties to maintain data integrity.'
        },
        {
          heading: 'A — Atomicity',
          type: 'points',
          points: [
            'A transaction is treated as a single unit',
            'Either ALL operations succeed or NONE of them do',
            'If any part fails, entire transaction is rolled back',
            'Example: Bank transfer — debit and credit both happen or neither'
          ]
        },
        {
          heading: 'C — Consistency',
          type: 'points',
          points: [
            'Database must remain consistent before and after transaction',
            'All data integrity constraints must be satisfied',
            'Invalid data can never be written to database'
          ]
        },
        {
          heading: 'I — Isolation',
          type: 'points',
          points: [
            'Concurrent transactions execute independently',
            'Intermediate state not visible to others',
            'Prevents dirty reads, phantom reads'
          ]
        },
        {
          heading: 'D — Durability',
          type: 'points',
          points: [
            'Once committed, transaction remains committed',
            'Data persists even after system failure',
            'Achieved through write-ahead logging'
          ]
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Remember: Atomicity = All or Nothing, Consistency = Valid State, Isolation = Independent, Durability = Permanent. Very frequently asked in GATE CS!'
        }
      ]
    },
    {
      id: 'cs2',
      title: 'Process Scheduling',
      subject: 'OS',
      icon: '💻',
      readTime: '7 min',
      topics: 5,
      content: [
        {
          heading: 'What is Process Scheduling?',
          type: 'text',
          text: 'Process scheduling handles removal of running process from CPU and selection of another process based on a particular strategy.'
        },
        {
          heading: 'Scheduling Algorithms',
          type: 'points',
          points: [
            'FCFS — First Come First Serve (non-preemptive)',
            'SJF — Shortest Job First (minimum avg waiting time)',
            'Round Robin — time quantum based (preemptive)',
            'Priority Scheduling — based on priority number',
            'SRTF — Shortest Remaining Time First'
          ]
        },
        {
          heading: 'Important Formulas',
          type: 'formula',
          text: 'Turnaround Time = Completion Time - Arrival Time\nWaiting Time = Turnaround Time - Burst Time\nResponse Time = First Response - Arrival Time'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'SJF gives minimum average waiting time. Round Robin is best for time-sharing. Always asked in GATE!'
        }
      ]
    },
    {
      id: 'cs3',
      title: 'OSI Model Layers',
      subject: 'Networks',
      icon: '🌐',
      readTime: '6 min',
      topics: 7,
      content: [
        {
          heading: 'What is OSI Model?',
          type: 'text',
          text: 'The OSI model is a conceptual framework with 7 layers that describes how data communication occurs between devices.'
        },
        {
          heading: '7 Layers (Top to Bottom)',
          type: 'points',
          points: [
            '7. Application — HTTP, FTP, SMTP, DNS',
            '6. Presentation — Encryption, Compression',
            '5. Session — Session management',
            '4. Transport — TCP, UDP, Port numbers',
            '3. Network — IP, Routing',
            '2. Data Link — MAC address, Framing',
            '1. Physical — Bits, Cables, Signals'
          ]
        },
        {
          heading: 'Mnemonic',
          type: 'formula',
          text: 'All People Seem To Need Data Processing\n(Application, Presentation, Session,\nTransport, Network, Data Link, Physical)'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'TCP/IP has 4 layers. OSI has 7. Remember which protocols belong to which layer!'
        }
      ]
    },
    {
      id: 'cs4',
      title: 'Binary Search Tree',
      subject: 'DSA',
      icon: '🌳',
      readTime: '8 min',
      topics: 6,
      content: [
        {
          heading: 'What is BST?',
          type: 'text',
          text: 'A Binary Search Tree is a node-based binary tree where left child is smaller and right child is greater than parent.'
        },
        {
          heading: 'Time Complexities',
          type: 'formula',
          text: 'Search:  Average O(log n), Worst O(n)\nInsert:  Average O(log n), Worst O(n)\nDelete:  Average O(log n), Worst O(n)\nWorst case when tree is skewed!'
        },
        {
          heading: 'Traversals',
          type: 'points',
          points: [
            'Inorder (L-Root-R) — gives sorted output',
            'Preorder (Root-L-R) — used for copying tree',
            'Postorder (L-R-Root) — used for deletion',
            'Level Order — BFS traversal'
          ]
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Inorder traversal of BST always gives sorted sequence. AVL tree is self-balancing BST. Very important for GATE!'
        }
      ]
    },
    {
      id: 'cs5',
      title: 'Normal Forms',
      subject: 'DBMS',
      icon: '📋',
      readTime: '7 min',
      topics: 5,
      content: [
        {
          heading: 'What is Normalization?',
          type: 'text',
          text: 'Normalization reduces redundancy and improves data integrity by dividing large tables into smaller ones.'
        },
        {
          heading: 'Normal Forms',
          type: 'points',
          points: [
            '1NF — Atomic values, no repeating groups',
            '2NF — 1NF + No partial dependencies',
            '3NF — 2NF + No transitive dependencies',
            'BCNF — Every determinant is candidate key',
            '4NF — BCNF + No multi-valued dependencies'
          ]
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: '2NF eliminates partial dependencies. 3NF eliminates transitive dependencies. Most GATE questions on 2NF, 3NF and BCNF!'
        }
      ]
    }
  ],

  ECE: [
    {
      id: 'ece1',
      title: 'Signals & Systems',
      subject: 'Signals',
      icon: '📡',
      readTime: '7 min',
      topics: 5,
      content: [
        {
          heading: 'Types of Signals',
          type: 'points',
          points: [
            'Continuous Time (CT) — defined for all values of t',
            'Discrete Time (DT) — defined only at integer values',
            'Periodic — repeats after period T: x(t) = x(t+T)',
            'Aperiodic — does not repeat',
            'Energy Signal — finite energy, zero average power',
            'Power Signal — finite average power, infinite energy'
          ]
        },
        {
          heading: 'Important Formulas',
          type: 'formula',
          text: 'Energy E = ∫|x(t)|² dt\nPower P = lim(T→∞) (1/2T) ∫|x(t)|² dt\nFourier Transform: X(f) = ∫x(t)e^(-j2πft) dt'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Sinusoidal signals are power signals. Impulse function is energy signal. Fourier Transform is most asked topic in ECE GATE!'
        }
      ]
    },
    {
      id: 'ece2',
      title: 'BJT & MOSFET',
      subject: 'Electronics',
      icon: '⚡',
      readTime: '8 min',
      topics: 6,
      content: [
        {
          heading: 'BJT Basics',
          type: 'points',
          points: [
            'Bipolar Junction Transistor — current controlled device',
            'Three terminals: Base, Collector, Emitter',
            'NPN: electrons are majority carriers',
            'PNP: holes are majority carriers',
            'β (beta) = IC/IB — current gain'
          ]
        },
        {
          heading: 'MOSFET Basics',
          type: 'points',
          points: [
            'Metal Oxide Semiconductor FET — voltage controlled device',
            'Three terminals: Gate, Drain, Source',
            'NMOS: electrons as carriers',
            'PMOS: holes as carriers',
            'No gate current flows (infinite input impedance)'
          ]
        },
        {
          heading: 'Key Formulas',
          type: 'formula',
          text: 'BJT: IC = β × IB\nMOSFET ID = (μnCox W/2L)(VGS-Vth)²\nTransconductance gm = 2ID/(VGS-Vth)'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'BJT is current controlled, MOSFET is voltage controlled. MOSFET has infinite input impedance. Very frequently asked in ECE GATE!'
        }
      ]
    },
    {
      id: 'ece3',
      title: 'Digital Circuits',
      subject: 'Digital',
      icon: '💡',
      readTime: '6 min',
      topics: 4,
      content: [
        {
          heading: 'Logic Gates',
          type: 'points',
          points: [
            'AND — output 1 only when ALL inputs are 1',
            'OR  — output 1 when ANY input is 1',
            'NOT — inverts input',
            'NAND/NOR — Universal gates',
            'XOR — output 1 when inputs are DIFFERENT'
          ]
        },
        {
          heading: 'Boolean Laws',
          type: 'formula',
          text: "De Morgan's: (A+B)' = A'.B'\nDe Morgan's: (A.B)' = A'+B'\nAbsorption: A + AB = A\nConsensus: AB + A'C + BC = AB + A'C"
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: "NAND and NOR are universal gates. De Morgan's theorem is most important for simplification. K-Map is used for minimization!"
        }
      ]
    }
  ],

  ME: [
    {
      id: 'me1',
      title: 'Thermodynamics Laws',
      subject: 'Thermodynamics',
      icon: '🌡️',
      readTime: '7 min',
      topics: 4,
      content: [
        {
          heading: 'Laws of Thermodynamics',
          type: 'points',
          points: [
            'Zeroth Law — Thermal equilibrium (basis of temperature)',
            'First Law — Energy conservation: dU = dQ - dW',
            'Second Law — Entropy always increases in isolated system',
            'Third Law — Entropy of perfect crystal at 0K is zero'
          ]
        },
        {
          heading: 'Important Formulas',
          type: 'formula',
          text: 'First Law: Q = ΔU + W\nCarnot Efficiency: η = 1 - (TL/TH)\nEntropy: dS = dQ/T\nIdeal Gas: PV = nRT'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Carnot cycle gives maximum efficiency. First law is energy conservation. Second law gives direction of process. Very important for ME GATE!'
        }
      ]
    },
    {
      id: 'me2',
      title: 'Fluid Mechanics',
      subject: 'Fluid Mechanics',
      icon: '💧',
      readTime: '8 min',
      topics: 5,
      content: [
        {
          heading: 'Key Concepts',
          type: 'points',
          points: [
            'Viscosity — resistance to flow (dynamic μ, kinematic ν)',
            'Reynolds Number — Re = ρVD/μ',
            'Re < 2000 — Laminar flow',
            'Re > 4000 — Turbulent flow',
            'Continuity equation — A1V1 = A2V2'
          ]
        },
        {
          heading: 'Bernoulli Equation',
          type: 'formula',
          text: 'P/ρg + V²/2g + z = constant\nwhere:\nP = pressure\nρ = density\nV = velocity\nz = elevation head'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Bernoulli equation assumes incompressible, inviscid, steady flow. Reynolds number determines flow type. Most asked in ME GATE fluid section!'
        }
      ]
    },
    {
      id: 'me3',
      title: 'Strength of Materials',
      subject: 'SOM',
      icon: '🏗️',
      readTime: '7 min',
      topics: 5,
      content: [
        {
          heading: 'Stress and Strain',
          type: 'points',
          points: [
            'Stress σ = Force / Area (N/m²)',
            'Strain ε = Change in length / Original length',
            "Young's Modulus E = σ/ε",
            "Poisson's Ratio ν = Lateral strain / Longitudinal strain",
            'Shear Stress τ = Shear Force / Area'
          ]
        },
        {
          heading: 'Important Formulas',
          type: 'formula',
          text: "Hooke's Law: σ = E × ε\nThermal Stress: σ = E × α × ΔT\nBending: M/I = σ/y = E/R\nTorsion: T/J = τ/r = Gθ/L"
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: "Hooke's law valid only in elastic region. Principal stresses found using Mohr's circle. Bending and torsion formulas are most asked in ME GATE!"
        }
      ]
    }
  ],

  CE: [
    {
      id: 'ce1',
      title: 'Structural Analysis',
      subject: 'Structures',
      icon: '🏛️',
      readTime: '7 min',
      topics: 5,
      content: [
        {
          heading: 'Types of Structures',
          type: 'points',
          points: [
            'Determinate — can be analyzed using equilibrium equations',
            'Indeterminate — requires compatibility equations',
            'Degree of Indeterminacy = reactions - equilibrium equations',
            'Beam — horizontal member carrying transverse loads',
            'Truss — framework of triangular units'
          ]
        },
        {
          heading: 'Important Formulas',
          type: 'formula',
          text: 'Static Indeterminacy: SI = r - 3\nFor Truss: SI = m + r - 2j\nBending Moment: M = EI(d²y/dx²)\nDeflection (UDL): δ = 5wL⁴/384EI'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Degree of static indeterminacy is very frequently asked. Virtual work method and moment distribution method are important for CE GATE!'
        }
      ]
    },
    {
      id: 'ce2',
      title: 'Concrete Technology',
      subject: 'Construction',
      icon: '🧱',
      readTime: '6 min',
      topics: 4,
      content: [
        {
          heading: 'Concrete Mix',
          type: 'points',
          points: [
            'Cement + Sand + Aggregate + Water',
            'Water-Cement ratio determines strength',
            'Lower W/C ratio = Higher strength',
            'M20 means characteristic strength = 20 N/mm²',
            'Workability measured by Slump Test'
          ]
        },
        {
          heading: 'IS Code Values',
          type: 'formula',
          text: 'M15: 1:2:4 mix ratio\nM20: 1:1.5:3 mix ratio\nM25: 1:1:2 mix ratio\nCuring period minimum: 7 days\nFull strength achieved: 28 days'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'W/C ratio is inversely proportional to strength. Slump test measures workability. 28-day strength is standard for concrete. Very asked in CE GATE!'
        }
      ]
    },
    {
      id: 'ce3',
      title: 'Soil Mechanics',
      subject: 'Geotechnical',
      icon: '🌍',
      readTime: '7 min',
      topics: 5,
      content: [
        {
          heading: 'Soil Properties',
          type: 'points',
          points: [
            'Void Ratio e = Vv/Vs',
            'Porosity n = Vv/V = e/(1+e)',
            'Degree of Saturation S = Vw/Vv',
            'Water Content w = Ww/Ws × 100%',
            'Bulk Density γ = W/V'
          ]
        },
        {
          heading: 'Shear Strength',
          type: 'formula',
          text: "Mohr-Coulomb: τ = c + σ tan(φ)\nwhere:\nc = cohesion\nφ = angle of internal friction\nσ = normal stress"
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: "Mohr-Coulomb failure criterion is most important. Terzaghi's consolidation theory asked frequently. Atterberg limits define soil plasticity!"
        }
      ]
    }
  ],

  EE: [
    {
      id: 'ee1',
      title: 'Electric Machines',
      subject: 'Machines',
      icon: '⚡',
      readTime: '8 min',
      topics: 6,
      content: [
        {
          heading: 'DC Machines',
          type: 'points',
          points: [
            'DC Generator — converts mechanical to electrical energy',
            'DC Motor — converts electrical to mechanical energy',
            'Back EMF: Eb = V - IaRa',
            'Torque: T = (PφZIa)/(2πA)',
            'Speed regulation = (No-load speed - Full load speed)/Full load speed'
          ]
        },
        {
          heading: 'Transformers',
          type: 'points',
          points: [
            'Works on principle of mutual induction',
            'Turns ratio: N1/N2 = V1/V2 = I2/I1',
            'Efficiency = Output/Input × 100%',
            'Maximum efficiency when copper loss = iron loss',
            'All day efficiency used for distribution transformers'
          ]
        },
        {
          heading: 'Key Formulas',
          type: 'formula',
          text: 'EMF equation: E = 4.44fNΦm\nSynchronous speed: Ns = 120f/P\nSlip: s = (Ns-N)/Ns\nRotor frequency: fr = sf'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Maximum efficiency of transformer when iron loss = copper loss. Synchronous speed formula is must know. Very frequently asked in EE GATE!'
        }
      ]
    },
    {
      id: 'ee2',
      title: 'Power Systems',
      subject: 'Power',
      icon: '🔌',
      readTime: '7 min',
      topics: 5,
      content: [
        {
          heading: 'Power System Components',
          type: 'points',
          points: [
            'Generation — Power plants (thermal, hydro, nuclear)',
            'Transmission — High voltage lines (132kV, 220kV, 400kV)',
            'Distribution — Low voltage (11kV, 415V, 230V)',
            'Per Unit System — normalizes values for easy calculation',
            'Load Flow — determines voltage and power in network'
          ]
        },
        {
          heading: 'Power Formulas',
          type: 'formula',
          text: 'Active Power: P = VIcosφ (Watts)\nReactive Power: Q = VIsinφ (VAR)\nApparent Power: S = VI (VA)\nPower Factor: pf = P/S = cosφ\nEfficiency: η = Output/Input'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Power factor correction using capacitors is important. Per unit system simplifies calculations. Fault analysis using symmetrical components is frequently asked!'
        }
      ]
    },
    {
      id: 'ee3',
      title: 'Control Systems',
      subject: 'Control',
      icon: '🎛️',
      readTime: '8 min',
      topics: 6,
      content: [
        {
          heading: 'Transfer Function',
          type: 'points',
          points: [
            'Ratio of Laplace transform of output to input',
            'Assumes zero initial conditions',
            'Poles — values of s where denominator = 0',
            'Zeros — values of s where numerator = 0',
            'System stable if all poles in left half s-plane'
          ]
        },
        {
          heading: 'Stability Criteria',
          type: 'formula',
          text: 'Routh-Hurwitz: all elements in first column positive\nGain Margin: 20log(1/|G(jω)| at phase = -180°\nPhase Margin: 180° + phase of G(jω) at |G|=1\nSteady state error: ess = lim(s→0) sE(s)'
        },
        {
          heading: 'Exam Tip',
          type: 'tip',
          text: 'Routh-Hurwitz criterion for stability without finding roots. Bode plot for frequency response. Root locus for effect of gain. All very important for EE GATE!'
        }
      ]
    }
  ]
}

export default notesData