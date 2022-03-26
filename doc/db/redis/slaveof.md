---
title: Redis主从复制
category: Redis
tag:
- Redis
- 分布式
---
# 主从复制

## 1.介绍

![主从复制结构](C:\Users\77856\Desktop\学习\java-top-view\doc\db\redis\images\主从复制结构.png)

主从复制，是指将一台Redis服务器的数据，复制到其他的Redis服务器。前者称为主节点(master)，后者称为从节点(slave)；数据的复制是单向的，只能由主节点到从节点。所以客户端只能对主节点进行写操作，但对所有节点都可进行读操作。

默认情况下，每台Redis服务器都是主节点；且一个主节点可以有多个从节点(或没有从节点)，但一个从节点只能有一个主节点。

## 2.主从复制的作用

1. 数据冗余：主从复制实现了数据的热备份，是持久化之外的一种数据冗余方式。
2. 故障恢复：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复；实际上是一种服务的冗余。
3. 负载均衡：在主从复制的基础上，配合读写分离，可以由主节点提供写服务，由从节点提供读服务（即写Redis数据时应用连接主节点，读Redis数据时应用连接从节点），分担服务器负载；尤其是在写少读多的场景下，通过多个从节点分担读负载，可以大大提高Redis服务器的并发量。
4. 高可用基石：除了上述作用以外，主从复制还是哨兵和集群能够实施的基础，因此说主从复制是Redis高可用的基础。

## 3.搭建主从复制

### 3.1 搭建主从复制的方法

上文中我们已经提到了，**每台Redis默认都是主服务节点**，所以当在搭建主从复制的时候，我们**不需要对主节点进行任何操作**，主要是针对从服务器来进行操作。

1. 命令行

当我们启动Redis从服务器的时候可以通过执行以下指令来来让当前服务成为某个服务的从节点

```shell
slaveof [ip] [port]
```

2. 修改redis.conf配置文件

```
# 在配置文件中增加
slaveof [ip] [port]
# 从服务器是否为只读模式（默认为yes）
slave-read-only yes
```

3. 断开主从复制

当从节点执行以下指令会断开主从复制，但需要注意的是，当**断开以后，已经同步的数据并不会消失，只是不再同步主服务器的数据**

```
slaveof no one
```

4. 补充

这里有一个很有意思的事儿，可能是因为文化差异的问题，`slave`其实也有奴隶的意思(可能不太吉利[手动狗头])，所以在新版本中的`slave`已经被替换为`replica`了，所以对应的指令也变成了`replicaof`，目前来说`slave`还是可以用的，两种方式并存，问题不大

### 3.2 动手搭建主从复制

首先，需要我们需要启动两个redis服务，如果是在一台机器上启动会导致端口冲突，所以在这里我们给从服务器的端口设置为6378

```shell
./redis-server
./redis-server --port 6378
```

当redis服务器启动好了以后呢，我们连接上6378，执行指令，使它变成从服务器

```shell
127.0.0.1:6378> slaveof 127.0.0.1 6379
OK
```

当指令执行完毕以后，我们可以看到，在从节点的日志中出现了如下信息，这就代表我们6378的服务已经成为了6379的从服务了，并且已经开始了数据同步

```
3048927:S 26 Mar 2022 18:00:45.363 * MASTER <-> REPLICA sync started
3048927:S 26 Mar 2022 18:00:45.363 * REPLICAOF 127.0.0.1:6379 enabled (user request from 'id=3 addr=127.0.0.1:35482 laddr=127.0.0.1:6378 fd=8 name= age=234 idle=0 flags=N db=0 sub=0 psub=0 multi=-1 qbuf=42 qbuf-free=40912 argv-mem=20 obl=0 oll=0 omem=0 tot-mem=61484 events=r cmd=slaveof user=default redir=-1')
3048927:S 26 Mar 2022 18:00:45.363 * Non blocking connect for SYNC fired the event.
3048927:S 26 Mar 2022 18:00:45.363 * Master replied to PING, replication can continue...
3048927:S 26 Mar 2022 18:00:45.363 * Trying a partial resynchronization (request 990bc301b1397f3bef7706adcd039b0c331c1c38:43).
3048927:S 26 Mar 2022 18:00:45.363 * Successful partial resynchronization with master.
3048927:S 26 Mar 2022 18:00:45.363 * MASTER <-> REPLICA sync: Master accepted a Partial Resynchronization.
```

### 3.3 动手测试

我们可以向主服务器中set一下数据，来测试一下从服务器是否能够同步到主服务器的数据

首先向主服务器set一条值为test数据，值为1

```
127.0.0.1:6379> set test 1
OK
127.0.0.1:6379> get test
"1"
```

接下来，我们可以在从服务器中测试一下，看是否能够获取到此数据

```
127.0.0.1:6378> get test
"1"
```

此时我们可以看到，在从服务器中已经可以拿到刚才在主服务器中set的值了，说明我们的主从复制模式已经生效了~

那么，除了这种方式呢，我们也可以通过`info`指令来查看主从复制的信息，具体内容放在了`Replication`中,

我们在从服务器中输入`info replication`可以看到如下信息。

```
127.0.0.1:6378> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:8
master_sync_in_progress:0
slave_read_repl_offset:1229
slave_repl_offset:1229
slave_priority:100
slave_read_only:1
replica_announced:1
connected_slaves:0
master_failover_state:no-failover
master_replid:990bc301b1397f3bef7706adcd039b0c331c1c38
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:1229
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:1229
```

通过这段信息可以明显的看出，当前服务器的角色是一个从服务器，所连接的主服务器为127.0.0.1:6379，当前连接正常，上一次同步为8秒前，等信息。

同样的，我们主服务器也一样可以在info中看到同步的情况，在此就不展示了。

## 4. 主从复制流程

刚才我们已经了解了主从复制是如何使用的，使用上很简单，这也是所有软件设计的一个初衷，但作为程序员的我们，不卷怎么行，我们还是要对他的流程和核心逻辑有所了解的。

主从复制的流程，大致分为如下三步：

1. 从服务器通过`psync`命令发送给主服务器已有的同步进度(同步源ID,同步进度offset)

这一步呢其实就是从服务器发起同步请求的一个过程，但是这个从服务器里面可能有数据，有可能是自己生成的数据，也可能是上次同步一半掉线了，甚至是这个数据可能是从其他服务器上同步的数据，所以他要把把源服务器的信息以及同步进去全都发过去。

2. master收到请求，如果同步源为当前的master，则进行增量同步
3. 如果同步源不是当前master，则进行全量同步：master直接生成rdb发送给从服务器，让从服务器加载到内存

这些信息，在上面的从服务器连接主服务器成功后的日志上其实可以看到。

## 5. 主从复制核心知识点

- Redis默认使用异步复制，slave和master之间异步的确认处理的数据量
- 一个master可以拥有多个slave
- slave下面也可以有slave
- 主从同步过程在master端是非阻塞的
- slave初次同步需要删除旧数据，再加载新数据，当加载完毕之前会阻塞其他请求

## 6. 注意事项

- 读写分离场景问题
  - 在数据复制时会导致读到过期的数据或读不到数据（网络原因、slave阻塞）
  - 从节点发生故障
- 全量复制情况下
  - 第一次建立连接或源ID不匹配时会导致全量复制
  - 故障转移时也会出现全量复制
- master故障重启后，所有slave都需要进行同步，如果在slave很多的情况下，势必会对master造成很大的负担
- 主从复制只有一台master，所以提供的写能力还是很有限的
- 如master无持久化，slave开启持久化的场景，master不要配置自动重启，master启动后无数据会导致整个集群数据丢失
- 对于带有有效期的key
  - slave不会使key过期，而是等待master让key过期后同步
  - 在lua脚本执行期间，不会执行key过期的操作
