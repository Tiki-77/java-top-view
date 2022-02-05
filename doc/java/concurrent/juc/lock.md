---
title: Lock接口及其实现
category: Java
tag:
- 多线程
---
## 锁的本质
举一个比较粗俗的例子，公共厕所里面的坑位，一般都是一个人一个坑，假如你想去上厕所，你不可能跟别人共享一个坑，所以要把门锁上，等”操作“完成后把锁打开然后出去，此时其他人就可以用这个坑了。那么把坑位看作是一个共享资源，那么当你占用坑位锁门和开门的动作呢，其实就是对共享资源锁的获取和释放的过程。

如果我到了厕所以后发现已经有人在用这个坑位了，我就需要等待里面那位老哥”操作“完以后才可以进去，那么这个过程，就是当共享资源被占用，需要等待锁的过程。

## 简单了解Lock接口

### locks层次结构

Java并发包`Java.util.concurrent`与锁相关的类几乎都存放在`java.util.concurrent.locks`包下，本文着重分析Lock接口。

![Lock接口结构图](.\image\Lock接口结构图.png)

根据上图我们可以看到，Lock接口的主要实现就是`ReentrantLock`以及`ReentrantReadWriteLock`的两个内部类`ReentrantReadWriteLock.ReadLock`、`ReentrantReadWriteLock.WriteLock`。

### Lock接口的方法

`Lock`接口有6个方法需要我们来实现：

* `void lock()`: 获取锁，没获取到就挂起，直到获取到锁为止；

* `boolean tryLock()`: 获取锁，无论成功与否都会立即返回，成功返回true，失败返回false；

* `boolean tryLock(long time, TimeUnit unit) throws InterruptedException`：获取锁，如在规定时间内未获取到锁则返回false，反之为true；
* `void lockInterruptibly() throws InterruptedException`：获取锁，与`void lock()`方法相似，但可被中断；

* `void unlock()`：释放锁，一般放在finally代码块中执行，防止异常后未释放锁；

* `Condition newCondition()`：返回一个绑定在当前锁上的`Condition `实例，在使用时，当前线程必须持有锁，否则会异常。

`lock()`方法是最常用的方法，`lockInterruptibly()`方法一般情况下代价很昂贵，有的实现类可能并没用实现此方法，只有真的需要相应中断操作时才会使用此方法，在使用前请先读一下实现类的方法描述或代码。

## Lock接口使用

### 基础使用

接下来，我们通过使用实现`Lock`接口的`ReentrantLock`来进一步加深对`Lock`接口的理解，下面请看代码：

```java
Lock lock = ...;
lock.lock(); // 获取锁
try {
    // balbalbal
} finally {
    lock.unlock(); // 释放锁
}
```

这是`Lock`接口推荐的一个标准写法，与`synchronized`不同，`synchronized`可以自动释放锁资源，而其他获取锁的方式需要手动释放，故推荐在`finally`代码块中的第一行来释放锁，防止业务代码出现异常时未释放锁的问题。

### Condition

`Condition`提供了一个类似于监视器的功能，可以把他理解为一个在`Lock`中的监视器方法（如`wait/notify`等），但是它的功能要比监视器方法强大，`Condition`支持在同一个锁中创建多个实例，也就是说一个锁中可以创建多个监视器，这样操作起来就更加灵活了。

下面请看一个简单示例：

```java
public class LockConditionDemo {
    public static void main(String[] args) throws InterruptedException {
        Lock lock = new ReentrantLock();
        Condition condition = lock.newCondition(); // 创建一个Condition实例
        // 创建一个线程，暂且叫他为th
        new Thread(() -> {
            lock.lock();                           // th 线程获取锁
            try {
                System.out.println("th 线程拿到锁了");
                condition.await();                 // 让 th 线程等待
                System.out.println("th 线程被唤醒");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();                     // th 线程释放锁
            }
        }).start();
        
        Thread.sleep(2000L);
        lock.lock();                               // main 线程获取锁
        try {
            System.out.println("main 线程拿到锁了");
            condition.signal();                    // 执行通知操作
        } finally {
            lock.unlock();                         // main 线程释放锁
        }
    }
}
```

示例代码中，共有两个进程th和main，

1. 首先让主线休眠2s，让th线程获取锁后执行等待操作

2. 在2s后主线程获取锁，执行了通知操作
3. th线程收到通知后被唤醒，继续向下执行

在这段代码中，有两个要注意的点，一是通知方法不要在等待方法前执行，否则会造成死锁，二是condition的操作一定要在获取到锁以后再进行，否则会抛出`IllegalMonitorStateException`异常

### 实现一个简单阻塞队列

接下来我们使用`Lock`与`Condition`配合编写一个简单的阻塞队列，代码如下

```java
public class MyBlockingQueue<E> {

    /**
     * 阻塞队列数据
     **/
    private final Queue<E> data = new LinkedList<>();
    /**
     * 阻塞队列容量
     **/
    private final int capacity;

    private final Lock lock = new ReentrantLock();
    /**
     * 插入监视器
     **/
    private final Condition putCondition = lock.newCondition();
    /**
     * 读取监视器
     **/
    private final Condition takeCondition = lock.newCondition();

    public MyBlockingQueue(int capacity) {
        this.capacity = capacity;
    }

    public void put(E e) {
        lock.lock();
        try {
            // 队列满了，挂起
            if (data.size() >= capacity) {
                putCondition.await();
            }
            // 队列还有空闲位置，入队
            data.offer(e);
            System.out.println("元素【" + e + "】入队成功");
            takeCondition.signal();
        } catch (InterruptedException ex) {
            ex.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public E take() {
        lock.lock();
        try {
            // 队列无数据，挂起
            if (data.isEmpty()) {
                takeCondition.await();
            }
            // 队列有数据，出队
            E obj = data.poll();
            System.out.println("元素【" + obj + "】出队成功");
            putCondition.signal();
            return obj;

        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
        return null;
    }
}
```

测试类：

```java
public static void main(String[] args) throws InterruptedException {
    MyBlockingQueue<String> bq = new MyBlockingQueue<>(3);
    for (int i = 0; i < 20; i++) {
        final int id = i;
        new Thread(() -> bq.put("id->" + id)).start();
    }
    Thread.sleep(1000L);
    System.out.println("开始取元素");
    for (int i = 0; i < 20; i++) {
        bq.take();
    }
}
```

其实这个就是一个简单的`生产者-消费者`问题，`put`方法就是生产者，`take`方法就是消费者，`data`队列就是我们的缓冲区，在多线程操作时呢，大约有如下几种情况：

1. 在`put`时，如队列未满，则执行入队操作，并`通知take`，表示队列中已有数据可以出队
2. 在`put`时，如队列已满，则`挂起put`，等待队列中有数据出队后方可执行入队操作
3. 在`take`时，如队列为空，则`挂起take`，等待队列中有数据入队后方可执行出队操作
4. 在`take`时，如队列不为空，则执行出队操作，并`通知put`，表示已有数据出队可执行入队操作



