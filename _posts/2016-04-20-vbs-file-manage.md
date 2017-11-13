---
layout: post
title: VBS脚本运行库 ——文本文件的建立、追加、删除等
key: 2016-04-20
tags: vbs
categories: notes
date: 2016-04-20 13:25
modify_date: 2016-04-20 13:25
---

文本文件对于系统管理员来说是一个强大的系统管工具。这个对于现在的高级的图形界面和多用户的操作系统来说好象是不可能的。但是，简单的文本文件，比如 notepad 文件，仍然是系统管理的一个关键元素。文本文件是轻便而且便于维护的。他们占用较少的磁盘空间不需要其它多余的软件支持。文本文件可以简单的工作并且非常容易携带。用文本文件写的脚本文件可以被复制和察看任何计算机的信息，虽然它运行的系统不是 Windows.此外，它还提供了快捷，简单，标准的办法来向脚本输入和输出数据。文本文件可以存储向脚本中输入的数据arguments）或者向脚本中硬编码。这样你就不用向命令行中输入100个服务器的名字，脚本可以从文本文件中读这些信息。同样，文本文件为存储脚本获取的信息提供了快捷简单的方法。这些数据可以直接写到数据库，但是这个要求在服务器上作额外的配置，额外的脚本代码，在脚本运行时候额外的管理。但是数据可以存在文本文件中，然后在稍后导入到数据中去。FSO 提供一些读写文本文件的方法。

<!--more-->

##  Creating Text Files

FSO 让你可以用现存在的文本工作，也可以让你自己创建脚本。为了创建一个新的文本文件，简单的创建一个 FSO 对象，然后调用 CreateTextFile 方法，输入完整的文件路径信息作为这个方法的参数。

例如，如下的脚本代码在文件夹 C:/FSO 中创建了一个 Scriptlog.txt 的文件：
```vb
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.CreateTextFile("C:/FSO/ScriptLog.txt")
```
如果这个文件存在，那么 CreateTextFile 方法会创建一个。如果这个文件已经存在，那么CreateTextFile 方法会复写存在的文本文件，而以新的空白的文件取代它。如果你希望这个文件不被取代，那么就用一个可以选择 Overwrite 的参数。当这个参数设置成 False 的时候，攒在的文件就不被复写。当这个参数被设置成 True（默认的是 True），那么就会复写存在的文件。例如，如下的脚本如果创建的文件存在的话就不会复写。
```vb
Set objFile = objFSO.CreateTextFile("C:/FSO/ScriptLog.txt", False)
```
如果你将参数设置成False，并且文件存在，那么就会有一个运行的错误。因为如此，你可以检查文件是否存在，如果存在，那么就作其它的操作，例如允许用户更改一个新的文件名。

## Creating File Names Within the Script

防止文件存在产生错误的方法是用脚本给文本文件生成一个名字。因为文件名字生成器并不创建一个有意义的名字，这对于你想在未来要命名的日志和其它文件来说不是一个好的办法。但是，这个对于需要临时文件的脚本来说保证了有个特定的文件名。例如，你或许想让你的脚本将数据保存在HTML 或者 XML 格式，然后将这些数据在 WEB 浏览器中显示，然后将这个临时文件在web 浏览器关掉时删除。在这种情况下，你可以用GetTempName 方法来生成一个特有的文件名。

为了生成一个特别的文件名，脚本首先要创建一个 FSO 对象实例然后调用 GetTempName 方法(不用参数。)例如在 4.33 中的脚本用一个 For Next 循环来随机生成 10 文件名字。
```vb
Set objFSO = CreateObject("Scripting.FileSystemObject")
For i = 1 to 10
strTempFile = objFSO.GetTempName
Wscript.Echo strTempFile
Next
```
用 GetTempName 来生成文件的名字生成的不是唯一的。部分原因是生成名称的算法，部  分是因为可能的名字的数量是有限的。文件名字被限制为 8 个字节，而且前三个字节规定为  rad，例如，你用脚本来创建 10000 个文件名字，在第 9894 个文件名字之后就不再是唯一的了，剩下的 106 个 53 对是复制的。

在 4.34 中的示例脚本用 GetTempName 方法来创建一个文件，脚本必须：

1. 创建一个 FSO 对象实例。

2. 创建一个给文件夹 C:/FSO 的变量叫做 strPath.

3. 用 GetTempName 方法来生成一个单独的文件名子。

4. 用 BuildPath 的方法来合并文件夹名字和文件名字来创建一个完成的临时文件的名字。这个    整个路径存储在 strFullName 变量中。

5. 调用 CreateTextFile 方法，用 strFullName 来作参数。

6. 在创建了这个文件之后，关闭这个文件。在生产环境中，大多数情况下，你可能要向里面写    了数据之后再关闭它。
```vb
 Set objFSO = CreateObject("Scripting.FileSystemObject")
strPath = "C:/FSO"
strFileName = objFSO.GetTempName
strFullName = objFSO.BuildPath(strPath, strFileName)
Set objFile = objFSO.CreateTextFile(strFullName)
objFile.Close
```


## Opening Text Files

用文本文件来工作有三个主要的步骤。在你可以作其它的事情之前，你必须打开文本文件。这个你可以打开存在的文件或者创建一个新的文本文件，创建结束之后，默认文件是打开的。每个方法都是返回一个TextStream 对象实例。

在你获得了 TextStream 对象之后，你可以向这个文件中写或者读这个文件。但是你不能向同一个文件读和写。换句话说，在同一个操作中，你不能打开一个文件，读这个文件然后再向这个文件中写东西。你必须读完这个文件后关闭，然后再打开这个文件，写入数据，然后关闭。

 当你打开一个存在的文件，这个文件要么是准备好被读的，要么是准备好被写的。如果你创建一个新的文本文件，这个文本文件只是被读的，没有什么其它原因的话，它没有内容去被读。最后，你要去关闭这个文本文件，虽然它不是必须的，因为在脚本结束的时候，它会自动关闭，但是这个对于程序实践来说是个好的办法。

为了打开一个文本文件：

1. 创建一个 FSO 对象实例。

2. 用:OpenTextFile 来打开一个文本文件。这个 OpenTextFile 需要两个参数，一个是一个文   件的路径，另外一个是跟着的参数：
```
For reading (parameter value = 1, constant = ForReading).
```
文件被打开之后只是被用来为读作准备的，为了写这个文件，你必须再一次的打开文件，用参数 ForWriting 或者 ForAppending。
```
For writing (parameter value 2, constant = ForWriting).
```
     文件被打开，并且写入的数据覆盖了原来存在的数据，就是说旧的数据被删除，新的被添加。用这个方法用新的数据来代替存在的数据。
```
For appending (parameter value 8, constant = ForAppending).
```
     文件在这种模式下打开，并且新的数据添加到文件的末尾。用这个方法向存在的文件中添加新的数据。

当打开文件的时候，你必须使用适当的参数。当你用读的模式打开一个文件而试图向里面写东西的时候，你会收到一个 bad file mode

的错误。你如果试图打开一个非文本文件的话也会收到同样的错误的。你可以直接用数值（比如 1 代表写）或者创建一个常量然后赋值给它适当的值。例如，如下的两种方法都可以打开一个文件并且准备被读：
```vb
Const ForReading = 1
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", ForReading)
Set objFile2 = objFSO.OpenTextFile("C:/FSO/ScriptLog2.txt", 1)
```
但是在没有定义这个常量的时候，你不能直接用。这是因为事实上 VB 脚本并没有这些 COM 对象常量。如下的脚本会返回一个 invalid procedure call or argument 的错误并且失败。这是因为ForReading 这个常量并没有显式的定义。因为它没有定义，所以这变量默认情况下被赋值为 0，而 0 对于 OpenTextFile 来说并不是一个合法的参数：
```vb
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", ForReading)
```
在 4.35 中的脚本打开了 C:/FSO/Scriptlog.txt 准备读，用了用户自己定义的变量，并且赋值为 1.

Listing 4.35 Opening a Text File for Reading

```vb
Const ForReading = 1
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", ForReading)
```


## Closing Text Files

所有的用脚本打开的文本文件在脚本结束的时候会自动关闭。因为如此，比不是必须的去显式的关闭一个文本文件。然而，关闭这个文本文件却是一个很好的程序实践并且在下面的一些情况下，如果不关闭文件的话，会产生一些错误。

 

 

## Reread the file.

有些时候你或许希望用一个脚本多次读一个文件。你或许打开一个文本文件然后将它所有的内容全部保存给一个字符串变量，然后搜索这个字符串来查找特定的错误的代码。当这个错误找到了，你再逐行去读取文件，提炼出有错误的每一行。如果你尝试多次去读一个文件，你不会收到你期待的结果，而是会遇到一个运行的错误。例如下的脚本读取一个文本文件，返回文件的内容到屏幕，然后尝试重复这样的过程：

```vb
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", 1)
Wscript.Echo "Reading file the first time:"
strContents = objFile.ReadAll
Wscript.Echo strContents
Wscript.Echo "Reading file the second time:"
Do While objFile.AtEndOfStream = False
 strLine = objFile.ReadLine
 Wscript.Echo strLine
Loop
```
当在 cscript 下运行的是命令行的信息如下：

  Reading file the first time:

  File line 1.

  File line 2.

  File line 3.

  Reading file the second time:

第一次文件是被读取的，内容存储在变量 strContents 上，第二次，文件读取的时候，没什有数据回显在屏幕上，这是因为文件已经到达了文件的末尾，没有其它的数据给你读了。为了读取这个数据，你必须关闭这个文件然后重新打开它。你不能在读到文件的末尾之后去跳到文件的开头去了。TextStreamObject.Close 方法用来关闭一个文本文件。例如，在 4.36 中的脚本创建一个FSO对象实例，然后打开一个文本文件，然后在立即关闭了。为了访问文件的内容，你必须再一次的调用 OpenTextFile 方法去重新打开这个文件。

Listing 4.36 Opening and Closing a Text File
```vb
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", 1)
objFile.Close
```


## Reading Text Files

在许多的企业脚本中，读取文本文件的内容是个标准进程，你可以用这个功能来读取命令行的参数。例如，你的文本文件包含了计算机名字的列表，脚本审计成读取这个列表，然后在每个计算机上运行这个脚本。搜索满足特定条件的日志文件。例如，你或许想找所有有错误的日志。将日志文件中添加内容并且汇入到数据库。例如，你或许有一个服务或者程序来保存信息到特定存文本文件格式。然后你用脚本来读取这个文件拷贝相关的信息到数据库中。

可以用 FSO 来都读取文本文件的内容，但是有以下几点你需要牢记：FSO 只能读取 ASCII 的文本文件。你不能用 FSO 读取unicode 或者

binary 文件格式的文件，比如 microsoft word 或者是 Microsoft excel .用 FSO读取文本文件的时候，只能有一种方式：从前到后。此外，FSO 读取文件的时候是逐行读取的。如果你试图返回前面的行，你必须从开始再重新读取，直到特定的行。

你不能打开一个文件同时用来读和写。如果你打开一个文件是为了读的，那么你想修改文件内容的时候，你必须重新打开文件。如果你尝试在写的模式下读取文件，那么你会收到一个bad file mode 的错误。

还有读取特定的字符然后停止也是我们常用的技巧。例如，如下的命令会读取第一行的前 12 个字符Alerter.Shar，并且将它赋值给变量

strText，然后停止：`strText = objTextFile.Read(12)`

ReadLine 读取文本文件中每行的信息然后在到达新的一行的之前停止。例如，如下的命令读取第一行并且将它赋值给变量strText，然后停止。strText = objTextFile.ReadLine

为了逐行读取整个文件的内容，将 ReadLine 放在一个循环中。

ReadAll    Reads the entire contents of a text file into a variable.

Skip       跳过特定的数目的字符之后停止。例如，如下的命令面跳过前面的 12 字节，后操作都说从第 13 个字符开始。
```vb
objTextFile.Skip(12)
```
SkipLine   跳过一整行。例如，如下的代码先读第一行，然后读取第三行。跳过了第二行
```vb
strText = objTextFile.Readline
objTextFile.SkipLine
strText = objTextFile.Readline
```

虽然在单独的一个字符串中寻找东西是很简单，但是不是要求特别快。用 ReadAll 方法在读取近 6000 行的测试文件的时候，每秒钟搜索大约 388kb。逐行读取的话也会小于一分钟的。

为了用 ReadAll 方法，打开一个文本文文件，然后调用 ReadAll 方法（不用参数的）例如在 4.38的脚本，打开文件C:/FSO/Scriptlog.txt，然后读取文件的内容，蒋数据存储在变量strContents 中，脚本然后回显这个变量的值，就是回显了文本文件的内容。

Listing 4.38 Reading a Text File Using the ReadAll Method
```vb
Const ForReading = 1
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", ForReading)
strContents = objFile.ReadAll
Wscript.Echo strContents
objFile.Close
```

## Reading a Text File Line by Line

为了达到系统管理的目的，文本文件有的时候像一个扁平的上数据库一样的工作。每一行代表数据库的一个纪录。例如，脚本经常在文本文件中读取服务器的名字，然后针对这些服务器来执行操作。在这些情况下，文本文件看起来和下面这些差不多的：


```
atl-dc-01
atl-dc-02
atl-dc-03
atl-dc-04
```
当文本文件当做扁平数据库的时候，脚本被用来读取每个纪录然后针对每个纪录作一些工作。例如，一个脚本或许读取第一个计算机名子，连接到它，实现一些功能。然后这个脚本读取第二个计算机的名字，连接到它，然后实现同样的功能。这个进程直到读取完了所有的计算机名字，然后结束。 

ReadLine 方法可以让你的脚本读取文本文件中单个的行。为了这个方法，打开一个文本文件，然后用一个 Do Loop 循环直到文件的

AtEndOfStream 属性为真。在这个循环中，调用ReadLine

方法，存储第一行的内容到一个变量，然后作一些动作。当脚本执行循环的时候，热它自动丢弃第一行的内容读取第二行的内容到这个变量。这个过程持续进行直到文件的结束。

例如，在 4.39 中的脚本打开文件 C:/FSO/Serverlist.txt 然后逐行读取整个文件，将内容回显在屏幕上：

Listing 4.39 Reading a Text File Using the ReadLine Method
```vb
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ServerList.txt", 1)
Do Until objFile.AtEndOfStream
 strLine = objFile.ReadLine
 Wscript.Echo strLine
Loop
objFile.Close
```

"Reading" a Text File from the Bottom to the Top

正如前面提到的，FSO 只能从文本文件的前面读到后面，你不能从后面向前面读。这个对于日志文件来说有一些问题，大部分的日志文件是按照日期格式来写的，它的最开始的第一个日志被纪录在第一行，第二个纪录纪录在第二行，依次类推。这就以为着你感兴趣的事情，最新的日志往往在文件末尾。

有的时候你希望按照反日期的顺序来显示信息，就是最近的纪录最先显示，最旧的纪录最后显示。虽然你不能从后面先前的读取文本文件，但是你要可以实现上面的目的，脚本必须： 

1. 创建一个数组来存储文本文件的每行信息

2. 用 ReadLine 的方法读取文本文件的每行信息，然后将每行的信息作为数组的一个独立的元    素存储在数组中。

3. 在屏幕上显示数组的信息，从数组的最后面开始，向前显示。

例如，在 4.40 中的脚本读取文件 C:/FSO/Scriptlog.txt 的信息，然后将每行的信息作为数组

的一个元素存储在数组 arrFileLine 中。在整个文件被读了之后，从数组的最后一个开始回显数组的信息。为了做到这点，用了一个 for

循环，从数组的最后一个元素，the upper bound of array 逐渐增长到第一个元素，the lower bound of array
```vb
Dim arrFileLines()
i = 0
 Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", 1)
Do Until objFile.AtEndOfStream
 Redim Preserve arrFileLines(i)
 arrFileLines(i) = objFile.ReadLine
 i = i + 1
Loop
objFile.Close
For l = Ubound(arrFileLines) to LBound(arrFileLines) Step -1
 Wscript.Echo arrFileLines(l)
Next
```
如果文件的内容和下面的一样：
```
6/19/2002    Success
6/20/2002    Failure
6/21/2002    Failure
6/22/2002    Failure
6/23/2002    Success
```
那么在屏幕上回显的信息如下:
```
6/23/2002     Success
6/22/2002     Failure
6/21/2002     Failure
6/20/2002     Failure
6/19/2002     Success
```
## Reading a Text File Character by Character

在一些定宽的文本文件中，区域是受长度的限制的。第一个 field1 或许包含 15 个字节，第 2个 field 或许含有十个，依次类推。那么这样的文件看起来和下面的差不多：
```
Server Value Status
atl-dc-0119345   OK
atl-printserver-02    00042  OK
atl-win2kpro-0500000   Failed
```
在有些情况下，你或许只是想获得 values 的值或者只是想获得 status 的信息。这个 value 的信息，容易表明。Values 总是从第 26

个字符开始，不超过 5 个字符。为了获得这些值，你只需要获得第 26,27,28,29,30 个字符的信息。

方法 Read 允许你读取特定数目的字节。它的一个单独的参数就是你要读的字节的个数。例如，如下的脚本代码示例，读取后面的 7 个字节，并将读取的值存给变量 strCharacters:
```vb
strCharacters = objFile.Read(7)
```
用 Skip 和 SkipLine 方法，你可以获得文本文件中你选择的特定字符。例如，在脚本 4.41 中只是读取每行的第 6 个字节。为了做到这点，脚本必须：

1. 跳过每行前面五个字节用 Skip(5)

2. 用 Read(1)读取第 6 个字节

3. 跳到下面一行。

Listing 4.41 Reading a Fixed-Width Text File
```vb
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", 1)
Do Until objFile.AtEndOfStream
 objFile.Skip(5)
 strCharacters = objFile.Read(1)
 Wscript.Echo strCharacters
 objFile.SkipLine
Loop
```
为了更好说明脚本是如何工作的，我们假设脚本文件 C:/FSO/Scriptlog.txt 看起来是如下的样子的：
```
XXXXX1XXXXXXXXXXXXXX
XXXXX2XXXXXXXXXXXXXXXXXXX
XXXXX3XXXXXXXXXXXXx
XXXXX4XXXXXXXXXXXXXXXXXXXXXXXXX
```
对于这个文件的每行，前面的五个字符都是 x，第六个是数字，后面是随机数量的 x。当脚本4.41 运行的时候，脚本会：

1. 打开文本文件从第一行开始读起。
2. 跳过前面五个字符。
3. 用 Read 载方法读取第六个字符
4. 回显字符在屏幕上
5. 跳到下面一行重复上面的进程，直到脚本运行结束。.

## Writing to Text Files

像文本文件中写入数据是写系统管理脚本的另外一个强大的功用。文本文件提供了一种方法可以让你将脚本获得的输入存储在其中。输入可以替代现有的文字或者是添加到现有的文字后面。文本文文件也可以纪录脚本的执行情况。这个对于debug 脚本来说费城有用。将脚本的执行纪录放在一个文本文件中，你可以过阵子来察看这个日志去决定脚本实际执行了哪些而哪些没有执行。FSO 给你提供了向文本文件中写如数据的能力。为了用 FSO 脚本向一个文本文件中写入数据，你必须：

1. 创建一个 FSO 对象实例。

2. 用 OpenTextFile 方法打开这个文本文件，你可以以两种方法打开：
```vb
For writing (parameter value 2, constant = ForWriting).
```
在这个模式下，写入新的数据会覆盖旧的数据。（旧的数据会被删除，新的数据添加上去。）

用这个模式，是将存在的文件换上新的内容。
```vb
For appending (parameter value 8, constant = ForAppending).
```
在这种模式下，数据写在原来文件的末尾。用这种模式向现有的文件中添加数据。

3. 用或者 Write,WriteLine,WriteBlankLine 方法来向文本文件中写入数据。

4. 关闭文本文件

向文本文件中写数据的三种方法在表格 4.9 中：

Table 4.9 Write Methods Available to the FileSystemObject

Method Description

Write 向文本文件中写入数据，不是添加文件到末尾。不会自动换行。

例如，如下代码写入两个单独的字符串：
```vb
objFile.Write ("This is line 1.")
objFile.Write ("This is line 2.")
```
MethodDescription

返回的数据类似如下：

This is line 1.This is line 2.

WriteLine   向文本文件中写入数据后添加一个换行符号，然后区自动换行的。

比如，如下的代码：
```vb
objFile.WriteLine ("This is line 1.")
objFile.WriteLine ("This is line 2.")
```
结果输出的信息如下：

This is line 1.

This is line 2.

WriteBlankLines 向文本文件中写入特定数目空白的行。例如如下的代码向文本文件中写入两行独立的文字，然后用空白的行分开：
```vb
objFile.Writeline ("This is line 1.")
objFile.WriteBlankLines(1)
objFile.Writeline ("This is line 2.")
```
输出的结果如下：

This is line 1.

This is line 2.

除了在表格 4.9 中的方法之外，VB 脚本提供了常量 VbTab 来向文本文件中写入。VbTab

向两个字符中插入一个空格。为了创建一个空格分隔的文件，代码和下面的类似：
```vb
objTextFile.WriteLine(objService.DisplayName & vbTab & objService.State)
```
FSO 的一个弱点就是它不能直接修改特定的行的信息。你不能写类似下面的命令：跳过到第五行，更改一些数据，然后保存成新的文件。为了修改在一个十行文件中的第五行，你的脚本必须

1. .读取整个 10 行
2. .将 1-4 行写回文件。
3. 写入修改好的第五行的内容。
4. 写入第 6 行到第 10 行的内容。


## Overwriting Existing Data

在系统管理中，简洁是一种美德。例如，假如你的脚本每天晚上运行，在你的 DC 上从事件日志中获得日志，将这些事件写入数据库中，纪录哪个计算机可以成功的连接到，哪个不可以。基于一些历史的目的，你或许希望跟踪明年一整年的所有成功和失败的纪录。这个对于脚本刚开始生效和网络不稳定的情况下来说，都是非常重要的。从另外的情况来说，你或许只是希望刚才脚本运行的时候发生了什么。换句话说说，你不是希望要一个日志中过去的 365 天的信息，而是要距离最近的信息。它让你可以很快的打开文件并且查找看脚本是否按照计划的运行。

当你的文本文件用 ForWriting 模式打开的，任何写入的新的数据会替代原来存在的文件。例如，假如你的文本文件里面存储了整个莎士比亚的故事全集，但是你用脚本以 ForWriting 模式打开了这个文本，并且向里面写了一个字母 a，那么当你的这个文件写完关闭之后，它就只是包含一个字母 a，原来的数据就全部丢失了。

这个脚本以 ForWriting 模式打开脚本 C:/FSO/Scriptlog.txt 然后将当前的日期和时间写入文件。每当脚本运行的时候，旧的时间和日期被新的取代，这个文本文件就永远只是有单独的一个日期的值。

Listing 4.42 Overwriting Existing Data
```vb
Const ForWriting = 2
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", ForWriting)
objFile.Write Now
objFile.Close
```

Appending New Data to Existing Data

许多脚本被设计成为在特定的时间间隔的时候运行，收据数据，保存数据。这些脚本的是用来分析趋势或者在过去的时间内部的使用情况。在这些情况下，你就不希望删除现在存在的数据而去替代成新的数据。 

例如，假如你用你的脚本监视进程使用量。在任何一个时间点上，进程的使用量应该是在 0 到100 之间的一个值，对于它自己来说，单个的值没有什么意义。为了获得进程使用的一个完整的图景，你需要重复不断的监视使用情况并纪录它的值。如果你的进程在每几秒钟之内返回的数据是9%,17%,92%,90%,79%,88%,91%那么你的进程使用是非常高的。这个就可以对比出这个时间内的使用情况。

 如果以 ForAppending 的模式打开一个文件，你可以使数据不是覆盖现有的数据，它的数据是添加到文件的底部。例如，在 4.43 中的脚本打开一个文本文件，并且将当前的日期和时间写入文件。因为是以 ForAppending

的模式打开的文件，当前的日期会卸载文件的底部。如果你在不同的时候分别运行脚本，你的脚本结束时候大约如下面的信息： 

```
6/25/2002 8:49:47 AM
6/25/2002 8:49:48 AM
6/25/2002 8:50:33 AM
6/25/2002 8:50:35 AM
```


Listing 4.43 Appending Data to a Text File
```vb
Const ForAppending = 8
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile("C:/FSO/ScriptLog.txt", ForAppending)
objFile.WriteLine Now
objFile.Close
```
上面的脚本用 WriteLine 方法写入数据保证每个日期都是独占一行的。如果这个脚本用 Write

的方法来写的话，那么这个脚本运行结束的时候，数据写在一起，如下的样子：

```
6/25/2002 8:49:47 AM6/25/2002 8:49:48 AM6/25/2002 8:50:33 AM6/25/2002 8:50:35 AM
```
