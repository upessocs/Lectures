

# **1. Pipelining*
Pipelining is a technique where multiple instructions are overlapped in execution to improve throughput. It divides instruction processing into stages, allowing concurrent execution.

## **1.1 Types of Pipelining**
### **(A) Arithmetic Pipeline**
- Used in floating-point operations, multiplication, etc.
- Example: **Floating-Point Adder Pipeline**  
**Stages:**  
1. **Compare Exponents**  
2. **Align Mantissas**  
3. **Add Mantissas**  
4. **Normalize Result**  

```
| Stage 1 | Stage 2 | Stage 3 | Stage 4 |
|---------|---------|---------|---------|
| I1      |         |         |         |
| I2      | I1      |         |         |
| I3      | I2      | I1      |         |
| I4      | I3      | I2      | I1      |
```

### **(B) Instruction Pipeline**
- Divides instruction execution into stages (Fetch, Decode, Execute, Write-back).  
- **Example: Four-Segment Instruction Pipeline**  
**Stages:**  
1. **Fetch (FI)** – Fetch instruction from memory.  
2. **Decode (DI)** – Decode instruction and fetch operands.  
3. **Execute (EI)** – Perform ALU operation.  
4. **Write-back (WO)** – Store result.  

```
| FI  | DI  | EI  | WO  |
|-----|-----|-----|-----|
| I1  |     |     |     |
| I2  | I1  |     |     |
| I3  | I2  | I1  |     |
| I4  | I3  | I2  | I1  |
```

## **1.2 Pipeline Conflicts**
### **(A) Resource Conflicts**
- Occurs when multiple instructions need the same hardware resource.  
**Example:** Two instructions trying to use the ALU simultaneously.  

### **(B) Data Dependency**
- **RAW (Read After Write):** Instruction 2 reads data before Instruction 1 writes it.  
- **WAR (Write After Read):** Instruction 2 writes before Instruction 1 reads.  
- **WAW (Write After Write):** Instruction 2 writes before Instruction 1 writes.  

### **(C) Branch Difficulties**
- **Control Hazards:** Pipeline stalls due to branch instructions.  
- **Solutions:**  
- **Branch Prediction** (Guess direction)  
- **Delayed Branching** (Execute next instruction regardless)  

## **1.3 Pipeline Handling Techniques**
- **Throughput:** Number of instructions completed per cycle.  
- **Speedup:**  
\[
\text{Speedup} = \frac{\text{Non-pipelined time}}{\text{Pipelined time}} = \frac{n \times k}{n + k - 1}
\]  
where \( n \) = instructions, \( k \) = stages.  
- **RISC Pipeline:** Uses simpler instructions to reduce pipeline stalls.  

---
# **2. Multiprogramming vs. Multiprocessing**
| **Feature**       | **Multiprogramming** | **Multiprocessing** |
|-------------------|---------------------|---------------------|
| **Definition**    | Multiple programs run concurrently (single CPU). | Multiple CPUs execute tasks simultaneously. |
| **CPU Usage**     | Switches between jobs (time-sharing). | Parallel execution. |
| **Example**       | Running Word and Browser together. | Supercomputers. |

---
# **3. Flynn’s Classification of Parallel Architectures**
| **Type** | **Description** | **Example** |
|----------|----------------|-------------|
| **SISD** (Single Instruction, Single Data) | One instruction stream, one data stream. | Traditional uniprocessor. |
| **SIMD** (Single Instruction, Multiple Data) | One instruction, multiple data streams. | GPUs, Vector processors. |
| **MISD** (Multiple Instruction, Single Data) | Multiple instructions, one data stream. | Rare (Fault-tolerant systems). |
| **MIMD** (Multiple Instruction, Multiple Data) | Multiple instructions, multiple data streams. | Multicore CPUs, Clusters. |

---
# **4. Multiprocessors**
### **(A) Shared Memory**
- All CPUs access a common memory.  
- **Example:** Symmetric Multiprocessing (SMP).  

```
[ CPU1 ] ---\
[ CPU2 ] ----> [ Shared Memory ]
[ CPU3 ] ---/
```

### **(B) Distributed Memory**
- Each CPU has its own memory.  
- **Example:** Clusters, Cloud Computing.  

```
[ CPU1 + Memory ] <-- Network --> [ CPU2 + Memory ]
```

---
# **5. Parallel Processing Techniques**
### **(A) Pipeline Processing**
- Overlapped execution (as discussed earlier).  

### **(B) Vector Processing**
- Executes operations on arrays (vectors).  
- **Example:** SIMD instructions (MMX, AVX).  

### **(C) Array Processors**
- Multiple ALUs execute the same operation on different data.  
- **Example:** Graphics rendering.  

---
# **Summary**
- **Pipelining** improves throughput but faces hazards (data/branch conflicts).  
- **Multiprogramming** vs **Multiprocessing** differ in CPU usage.  
- **Flynn’s Classification** categorizes parallel architectures.  
- **Multiprocessors** can be shared/distributed memory.  
- **Parallel Processing** includes pipelines, vector, and array processing.  
